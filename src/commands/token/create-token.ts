import { readFile } from 'fs/promises'
import { generateKeyPairSync } from 'node:crypto'
import { Flags, ux } from '@oclif/core'
import { v4 as uuidv4 } from 'uuid'
import { z } from 'zod'
import { BaseCommand, SupportedAlgorithms } from '../../common'
import { promptRequiredParameters } from '../../common/prompts'
import { INPUT_LIMIT } from '../../common/validators'
import { getKeyType, pemToJWK } from '../../helpers/jwk'
import { bffService } from '../../services/affinidi/bff-service'
import { iamService } from '../../services/affinidi/iam'
import { TokenDto, JsonWebKeySetDto } from '../../services/affinidi/iam/iam.api'

export class CreateToken extends BaseCommand<typeof CreateToken> {
  static summary = 'Creates a Personal Access Token (PAT)'
  static examples = [
    '<%= config.bin %> <%= command.id %> -n MyNewToken -w -p top-secret',
    '<%= config.bin %> <%= command.id %> --name MyNewToken --with-permissions --passphrase top-secret',
    '<%= config.bin %> <%= command.id %> -n MyNewToken -k MyKeyID -f publicKey.pem',
    '<%= config.bin %> <%= command.id %> --name "My new token" --key-id MyKeyID --public-key-file publicKey.pem --algorithm RS256',
  ]
  static flags = {
    name: Flags.string({
      char: 'n',
      summary: 'Name of the Personal Access Token, at least 8 chars long',
    }),
    'key-id': Flags.string({
      char: 'k',
      summary: 'Identifier of the key (kid)',
    }),
    'public-key-file': Flags.string({
      char: 'f',
      summary: 'Location of the public key PEM file',
      required: false,
    }),
    algorithm: Flags.custom<SupportedAlgorithms>({
      char: 'a',
      summary: 'The specific cryptographic algorithm used with the key',
      options: Object.values(SupportedAlgorithms),
      default: SupportedAlgorithms.RS256,
    })(),
    'with-permissions': Flags.boolean({
      char: 'w',
      default: false,
      summary: 'Create ready-to-use PAT with auto-generated private public key pair and set its access policies',
    }),
    passphrase: Flags.string({
      char: 'p',
      summary: 'Passphrase for generation of private public key pair',
      required: false,
    }),
  }

  public async run(): Promise<TokenDto> {
    const { flags } = await this.parse(CreateToken)

    await this.validateFlags(flags)

    ux.action.start('Creating Personal Access Token')

    const { token, publicKey, privateKey } = await this.createToken(flags)

    let projectId

    if (flags['with-permissions']) {
      const promises = [this.addPrincipal(token.id), bffService.getActiveProject()]

      const [, project] = await Promise.all(promises)
      projectId = project?.id

      // NOTE: Should run after addPrincipal is completed
      await this.updatePolicies(token.id)
    }

    ux.action.stop('Created successfully!')

    this.logToken(flags, token, publicKey, privateKey, projectId as string)

    return token
  }

  private logToken(
    flags: CreateToken['flags'],
    token: TokenDto,
    publicKey: string,
    privateKey: string,
    projectId: string,
  ) {
    if (this.jsonEnabled()) return

    if (!flags['with-permissions']) {
      this.logJson(token)
      return
    }

    const isDev = process.env.AFFINIDI_CLI_ENVIRONMENT === 'dev'

    const out = {
      apiGatewayUrl: isDev ? 'https://apse1.dev.api.affinidi.io' : 'https://apse1.api.affinidi.io',
      tokenEndpoint: isDev
        ? 'https://apse1.dev.auth.developer.affinidi.io/auth/oauth2/token'
        : 'https://apse1.auth.developer.affinidi.io/auth/oauth2/token',
      keyId: flags['key-id'],
      tokenId: token.id,
      passphrase: flags.passphrase,
      privateKey,
      publicKey,
      projectId,
    }

    this.logJson(out)

    this.warn(
      this.chalk.red.bold(
        'These are your PAT variables for Affinidi TDK.\n❗Please save publicKey and privateKey somewhere safe.\nYou will not be able to view those again.',
      ),
    )
  }

  private async validateFlags(flags: CreateToken['flags']) {
    let promptFlags

    if (flags['with-permissions']) {
      promptFlags = await promptRequiredParameters(['name', 'passphrase'], flags)
    } else {
      promptFlags = await promptRequiredParameters(['name', 'public-key-file'], flags)
    }

    if (!flags['key-id']) {
      flags['key-id'] = uuidv4()
    }

    const schema = z.object({
      name: z.string().max(INPUT_LIMIT).min(8),
      algorithm: z.nativeEnum(SupportedAlgorithms),
      'key-id': z.string().max(INPUT_LIMIT),
      ...(flags['with-permissions'] && { passphrase: z.string().max(INPUT_LIMIT).min(8) }),
      ...(!flags['with-permissions'] && { 'public-key-file': z.string().max(INPUT_LIMIT) }),
    })

    schema.parse(promptFlags)
  }

  private generateKeyPair(passphrase: string, keyId: string, algorithm: string) {
    const { publicKey, privateKey } = generateKeyPairSync('rsa', { modulusLength: 4096 })

    const publicKeyPem = publicKey.export({ format: 'pem', type: 'spki' })
    const privateKeyPem = privateKey.export({
      format: 'pem',
      type: 'pkcs8',
      cipher: 'aes-256-cbc',
      passphrase,
    })

    const publicKeyJwk = publicKey.export({ format: 'jwk' })

    const jwks = {
      keys: [
        {
          use: 'sig',
          kid: keyId,
          alg: algorithm,
          ...publicKeyJwk,
        },
      ],
    }

    return { publicKey: publicKeyPem, privateKey: privateKeyPem, jwks }
  }

  private async createToken(flags: CreateToken['flags']) {
    let jwks: JsonWebKeySetDto
    let keypair

    const algorithm = flags.algorithm as SupportedAlgorithms

    if (flags['with-permissions']) {
      keypair = this.generateKeyPair(flags.passphrase as string, flags['key-id'] as string, algorithm)

      jwks = keypair.jwks as JsonWebKeySetDto
    } else {
      const publicKeyPEM = await readFile(flags['public-key-file'] as string, 'utf8')
      const jwk = await pemToJWK(publicKeyPEM, algorithm)

      jwks = {
        keys: [
          {
            kid: flags['key-id'] as string,
            alg: algorithm,
            use: 'sig',
            kty: jwk.kty ?? getKeyType(algorithm),
            n: jwk.n,
            e: jwk.e,
          },
        ],
      }
    }

    const token = await iamService.createToken({
      name: flags.name as string,
      authenticationMethod: {
        type: 'PRIVATE_KEY',
        signingAlgorithm: algorithm,
        publicKeyInfo: {
          jwks,
        },
      },
    })

    return { token, publicKey: keypair?.publicKey as string, privateKey: keypair?.privateKey as string }
  }

  private async addPrincipal(tokenId: string) {
    await iamService.addPrincipalToProject({
      principalId: tokenId,
      principalType: 'token',
    })
  }

  private async updatePolicies(tokenId: string) {
    const policies = await iamService.getPolicies(tokenId, 'token')

    policies.statement[0].action[0] = '*'
    policies.statement[0].resource[0] = '*'

    await iamService.updatePolicies(tokenId, 'token', policies)
  }
}
