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
    '<%= config.bin %> <%= command.id %> -n MyNewToken -q -p top-secret',
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
    quiet: Flags.boolean({
      char: 'q',
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

    await this.addPrincipal(token.id)
    await this.updatePolicies(token.id)

    ux.action.stop('Created successfully!')

    await this.logToken(flags, token, publicKey, privateKey)

    return token
  }

  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  private async logToken(flags: any, token: TokenDto, publicKey: string, privateKey: string) {
    const out = {
      apiGatewayUrl:
        process.env.AFFINIDI_CLI_ENVIRONMENT === 'dev'
          ? 'https://apse1.dev.api.affinidi.io'
          : 'https://apse1.api.affinidi.io',
      tokenEndpoint:
        process.env.AFFINIDI_CLI_ENVIRONMENT === 'dev'
          ? 'https://apse1.dev.auth.developer.affinidi.io/auth/oauth2/token'
          : 'https://apse1.auth.developer.affinidi.io/auth/oauth2/token',
      keyId: flags['key-id'],
      tokenId: token.id,
      passphrase: flags.passphrase,
      privateKey,
      publicKey,
      projectId: (await bffService.getActiveProject()).id,
    }

    if (!this.jsonEnabled()) flags.quiet ? this.logJson(out) : this.logJson(token)

    if (flags.quiet) {
      this.warn(
        this.chalk.red.bold(
          'These are your PAT environment variables that can be used in Affinidi TDK. ❗️Please save publicKey and privateKey somewhere safe. You will not be able to view those again.',
        ),
      )
    }
  }

  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  private async validateFlags(flags: any) {
    let promptFlags

    if (flags.quiet) {
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
      ...(flags.quiet && { passphrase: z.string().max(INPUT_LIMIT).min(8) }),
      ...(!flags.quiet && { 'public-key-file': z.string().max(INPUT_LIMIT) }),
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

  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  private async createToken(flags: any) {
    let jwks: JsonWebKeySetDto
    let keypair

    if (flags.quiet) {
      keypair = this.generateKeyPair(flags.passphrase as string, flags['key-id'] as string, flags.algorithm as string)

      jwks = keypair.jwks as JsonWebKeySetDto
    } else {
      const publicKeyPEM = await readFile(flags['public-key-file'] as string, 'utf8')
      const jwk = await pemToJWK(publicKeyPEM, flags.algorithm)

      jwks = {
        keys: [
          {
            kid: flags['key-id'] as string,
            alg: flags.algorithm,
            use: 'sig',
            kty: jwk.kty ?? getKeyType(flags.algorithm),
            n: jwk.n,
            e: jwk.e,
          },
        ],
      }
    }

    const token = await iamService.createToken({
      name: flags.name,
      authenticationMethod: {
        type: 'PRIVATE_KEY',
        signingAlgorithm: flags.algorithm,
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
