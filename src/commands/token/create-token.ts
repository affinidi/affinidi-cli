import { readFile } from 'fs/promises'
import { generateKeyPairSync } from 'node:crypto'
import { Flags, ux } from '@oclif/core'
import { v4 as uuidv4 } from 'uuid'
import { z } from 'zod'
import { BaseCommand, SupportedAlgorithms } from '../../common'
import { promptRequiredParameters } from '../../common/prompts'
import { INPUT_LIMIT, policiesDataSchema, validateInputLength } from '../../common/validators'
import { getKeyType, pemToJWK } from '../../helpers/jwk'
import { bffService } from '../../services/affinidi/bff-service'
import { iamService } from '../../services/affinidi/iam'
import { TokenDto, JsonWebKeySetDto } from '../../services/affinidi/iam/iam.api'
import { confirm, input } from '@inquirer/prompts'
import chalk from 'chalk'

type Token = {
  token: TokenDto
  privateKey?: string
  passphrase?: string
}

const flagsSchema = z
  .object({
    name: z.string().max(INPUT_LIMIT),
    algorithm: z.nativeEnum(SupportedAlgorithms),
    'key-id': z.string().max(INPUT_LIMIT),
    'public-key-file': z.string().max(INPUT_LIMIT).optional(),
    'auto-generate-key': z.boolean(),
    passphrase: z.string().max(INPUT_LIMIT).optional(),
    'with-permissions': z.boolean(),
    resources: z.string().max(INPUT_LIMIT).optional(),
    actions: z.string().max(INPUT_LIMIT).optional(),
  })
  .refine(
    (data) => {
      if (!data['auto-generate-key'] && !data['public-key-file']) {
        return false
      }
      return true
    },
    {
      message: 'public-key-file is required when auto-generate-key is false',
      path: ['public-key-file'],
    },
  )

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
      required: false,
      summary: 'Set token policies to perform any action on the active project',
    }),
    'auto-generate-key': Flags.boolean({
      char: 'g',
      required: false,
      summary: 'Auto-generate private-public key pair',
      exclusive: ['public-key-file'],
    }),
    passphrase: Flags.string({
      char: 'p',
      summary: 'Passphrase for generation of private public key pair',
      required: false,
      dependsOn: ['auto-generate-key'],
    }),
  }

  public async run(): Promise<Token> {
    const { flags } = await this.parse(CreateToken)
    const validatedFlags = await this.validateFlags(flags)

    ux.action.start('Creating Personal Access Token')
    let keypair, jwks
    if (validatedFlags['auto-generate-key']) {
      keypair = this.generateKeyPair(validatedFlags['key-id'], validatedFlags.algorithm, validatedFlags.passphrase)
      jwks = keypair.jwks as JsonWebKeySetDto
    } else {
      const publicKeyPEM = await readFile(validatedFlags['public-key-file'] as string, 'utf8')
      const jwk = await pemToJWK(publicKeyPEM, validatedFlags.algorithm)
      jwks = {
        keys: [
          {
            kid: validatedFlags['key-id'] as string,
            alg: validatedFlags.algorithm,
            use: 'sig',
            kty: jwk.kty ?? getKeyType(validatedFlags.algorithm),
            n: jwk.n,
            e: jwk.e,
          },
        ],
      }
    }
    const token = await this.createToken(validatedFlags.name, validatedFlags.algorithm, jwks)
    ux.action.stop('Created successfully!')

    const out: Token = {
      token,
    }
    if (validatedFlags['auto-generate-key']) {
      out['privateKey'] = keypair?.privateKey as string
      out['passphrase'] = validatedFlags.passphrase
      if (!this.jsonEnabled()) {
        if (validatedFlags['auto-generate-key']) {
          this.warn(
            this.chalk.red.bold(
              'Please save privateKey and passphrase somewhere safe. You will not be able to view them again.',
            ),
          )
        }
      }
    }
    if (!this.jsonEnabled()) this.logJson(out)

    if (validatedFlags['with-permissions']) {
      // todo add setting of policies
      // todo validate no-input flag
      // todo validate json flag

      ux.action.start('Adding token to project')
      const promises = [this.addPrincipal(token.id), bffService.getActiveProject()]
      const [, activeProject] = await Promise.all(promises)
      ux.action.stop('Added successfully!')

      ux.action.start('Granting permissions to token')
      await this.updatePolicies(
        token.id,
        activeProject!.id,
        validatedFlags.actions ?? '*',
        validatedFlags.resources ?? '*',
      )
      ux.action.stop('Granted successfully!')

      if (!this.jsonEnabled()) {
        const connectionString = JSON.stringify({
          project: activeProject!.id,
          token: token.id,
          key: validatedFlags['key-id'],
        })
        this.log(
          '\nUse the private key, passphrase and the following connection string to use this token with Affinidi TDK:',
        )
        this.log(`${chalk.inverse(connectionString)}\n`)
      }
    }

    return out
  }

  private async validateFlags(flags: CreateToken['flags']) {
    let promptFlags = await promptRequiredParameters(['name'], flags)

    if (!promptFlags['no-input']) {
      promptFlags['auto-generate-key'] ??= await confirm({
        message: 'Generate a new keypair for the token?',
      })
    }

    if (promptFlags['auto-generate-key']) {
      promptFlags = await promptRequiredParameters(['passphrase'], promptFlags)
    } else {
      promptFlags = await promptRequiredParameters(['public-key-file'], promptFlags)
    }

    if (!promptFlags['no-input']) {
      promptFlags['with-permissions'] ??= await confirm({
        message: 'Add token to active project and grant permissions?',
      })
    }

    if (promptFlags['with-permissions']) {
      promptFlags['resources'] = validateInputLength(
        await input({
          message: 'Enter the allowed resources, separated by spaces. Use * to allow access to all project resources',
          default: '*',
        }),
        INPUT_LIMIT,
      )
      promptFlags['actions'] = validateInputLength(
        await input({
          message: 'Enter the allowed actions, separated by spaces. Use * to allow all actions',
          default: '*',
        }),
        INPUT_LIMIT,
      )
    }

    promptFlags['key-id'] ??= uuidv4()

    return flagsSchema.parse(promptFlags)
  }

  private async createToken(name: string, algorithm: SupportedAlgorithms, jwks: JsonWebKeySetDto) {
    return await iamService.createToken({
      name,
      authenticationMethod: {
        type: 'PRIVATE_KEY',
        signingAlgorithm: algorithm,
        publicKeyInfo: {
          jwks,
        },
      },
    })
  }

  private generateKeyPair(keyId: string, algorithm: string, passphrase?: string) {
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

  private async addPrincipal(tokenId: string) {
    await iamService.addPrincipalToProject({
      principalId: tokenId,
      principalType: 'token',
    })
  }

  private async updatePolicies(tokenId: string, activeProjectId: string, actions: string, resources: string) {
    const policiesData = {
      version: '2022-12-15',
      statement: [
        {
          principal: [`ari:iam::${activeProjectId}:token/${tokenId}`],
          action: actions.split(' '),
          resource: resources.split(' '),
          effect: 'Allow',
        },
      ],
    }
    const validatedPolicies = policiesDataSchema.parse(policiesData)
    const result = await iamService.updatePolicies(tokenId, 'token', validatedPolicies)
    return result
  }
}
