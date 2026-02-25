import { readFile } from 'fs/promises'
import { TokenDto, JsonWebKeySetDto } from '@affinidi-tdk/iam-client'
import { confirm, input } from '@inquirer/prompts'
import { Flags, ux } from '@oclif/core'
import { v4 as uuidv4 } from 'uuid'
import { z } from 'zod'
import { BaseCommand } from '../../common/base-command.js'
import { INPUT_LIMIT, SupportedAlgorithms, TOKEN_NAME_MIN_LENGTH } from '../../common/constants.js'
import { promptRequiredParameters } from '../../common/prompts.js'
import { validateInputLength } from '../../common/validators.js'
import { getKeyType, pemToJWK } from '../../helpers/jwk.js'
import {
  addPrincipal,
  createToken,
  generateDefaultTokenName,
  generateKeyPair,
  updatePolicies,
} from '../../helpers/token.js'
import { bffService } from '../../services/affinidi/bff-service.js'

const flagsSchema = z
  .object({
    name: z.string().min(TOKEN_NAME_MIN_LENGTH).max(INPUT_LIMIT),
    algorithm: z.nativeEnum(SupportedAlgorithms),
    'key-id': z.string().max(INPUT_LIMIT).optional(),
    'public-key-file': z.string().max(INPUT_LIMIT).optional(),
    'auto-generate-key': z.boolean(),
    passphrase: z.string().max(INPUT_LIMIT).optional(),
    'with-permissions': z.boolean(),
    resources: z.string().max(INPUT_LIMIT).optional().default('*'),
    actions: z.string().max(INPUT_LIMIT).optional().default('*'),
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
    '<%= config.bin %> <%= command.id %>',
    '<%= config.bin %> <%= command.id %> --name "My new token"',
    '<%= config.bin %> <%= command.id %> -n MyNewToken --with-permissions',
    '<%= config.bin %> <%= command.id %> -n MyNewToken --auto-generate-key',
    '<%= config.bin %> <%= command.id %> -n MyNewToken --auto-generate-key --passphrase "MySecretPassphrase" --with-permissions',
    '<%= config.bin %> <%= command.id %> -n MyNewToken --public-key-file publicKey.pem --key-id MyKeyID --algorithm RS256 --with-permissions',
    '<%= config.bin %> <%= command.id %> -n MyNewToken -g -w',
  ]
  static flags = {
    name: Flags.string({
      char: 'n',
      summary: 'Name of the Personal Access Token, at least 8 chars long',
      default: generateDefaultTokenName(),
    }),
    'key-id': Flags.string({
      char: 'k',
      summary: 'Identifier of the key (kid)',
    }),
    'public-key-file': Flags.string({
      char: 'f',
      summary: 'Location of the public key PEM file',
    }),
    algorithm: Flags.custom<SupportedAlgorithms>({
      char: 'a',
      summary: 'The specific cryptographic algorithm used with the key',
      options: Object.values(SupportedAlgorithms),
      default: SupportedAlgorithms.RS256,
    })(),
    'with-permissions': Flags.boolean({
      char: 'w',
      summary: 'Set token policies to perform any action on the active project',
    }),
    'auto-generate-key': Flags.boolean({
      char: 'g',
      summary: 'Auto-generate private-public key pair',
      exclusive: ['public-key-file'],
    }),
    passphrase: Flags.string({
      char: 'p',
      summary: 'Passphrase for generation of private public key pair',
      dependsOn: ['auto-generate-key'],
    }),
  }

  public async run(): Promise<TokenDto> {
    const { flags } = await this.parse(CreateToken)
    const validatedFlags = await this.validateFlags(flags)

    ux.action.start('Creating Personal Access Token')
    let keypair, jwks
    const kid = validatedFlags['key-id'] ?? uuidv4()
    if (validatedFlags['auto-generate-key']) {
      keypair = generateKeyPair(kid, validatedFlags.algorithm, validatedFlags.passphrase)
      jwks = keypair.jwks as JsonWebKeySetDto
    } else {
      const publicKeyPEM = await readFile(validatedFlags['public-key-file'] as string, 'utf8')
      const jwk = await pemToJWK(publicKeyPEM, validatedFlags.algorithm)
      jwks = {
        keys: [
          {
            kid,
            alg: validatedFlags.algorithm,
            use: 'sig',
            kty: jwk.kty ?? getKeyType(validatedFlags.algorithm),
            n: jwk.n,
            e: jwk.e,
          },
        ],
      }
    }
    const token = await createToken(validatedFlags.name, validatedFlags.algorithm, jwks, validatedFlags['key-id'])

    ux.action.stop('Created successfully!')

    let projectId
    if (validatedFlags['with-permissions']) {
      ux.action.start('Adding token to active project')
      const promises = [addPrincipal(token.id), bffService.getActiveProject()]
      const [, activeProject] = await Promise.all(promises)
      projectId = activeProject!.id
      ux.action.stop('Added successfully!')

      ux.action.start('Granting permissions to token')
      const actions = validatedFlags.actions ? validatedFlags.actions.split(' ') : ['*']
      const resources = validatedFlags.resources ? validatedFlags.resources.split(' ') : ['*']
      await updatePolicies(token.id, projectId, actions, resources)
      ux.action.stop('Granted successfully!')
    }

    if (!this.jsonEnabled()) {
      this.logJson(token)
      this.log('\nCopy the following fields to use this token with Affinidi TDK')
      this.logJson({
        tokenId: token.id,
        ...(validatedFlags['key-id'] && { keyId: validatedFlags['key-id'] }),
        ...(validatedFlags['with-permissions'] && { projectId }),
        ...(validatedFlags['auto-generate-key'] && {
          privateKey: keypair?.privateKey as string,
          ...(validatedFlags.passphrase && { passphrase: validatedFlags.passphrase }),
        }),
      })
      if (validatedFlags['auto-generate-key']) {
        this.warn(
          this.chalk.yellowBright.bold(
            '\nPlease save the privateKey and passphrase (if provided) somewhere safe. You will not be able to view them again.\n',
          ),
        )
      }
    }
    return token
  }

  private async validateFlags(flags: CreateToken['flags']) {
    let promptFlags = await promptRequiredParameters(['name'], flags)

    if (!promptFlags['public-key-file'] && !promptFlags['no-input']) {
      promptFlags['auto-generate-key'] ??= await confirm({
        message: 'Generate a new keypair for the token?',
      })
    } else {
      promptFlags['auto-generate-key'] = !!promptFlags['auto-generate-key']
    }

    if (promptFlags['auto-generate-key'] && !promptFlags['no-input']) {
      promptFlags.passphrase ??= validateInputLength(
        await input({
          message: 'Enter a passphrase to encrypt the private key. Leave it empty for no encryption',
        }),
        INPUT_LIMIT,
      )
    }
    if (!promptFlags['auto-generate-key']) {
      promptFlags = await promptRequiredParameters(['public-key-file'], promptFlags)
    }

    if (!promptFlags['no-input']) {
      promptFlags['with-permissions'] ??= await confirm({
        message: 'Add token to active project and grant permissions?',
      })
    } else {
      promptFlags['with-permissions'] = !!promptFlags['with-permissions']
    }

    if (!promptFlags['no-input'] && promptFlags['with-permissions']) {
      promptFlags.resources = validateInputLength(
        await input({
          message: 'Enter the allowed resources, separated by spaces. Use * to allow access to all project resources',
          default: '*',
        }),
        INPUT_LIMIT,
      )
      promptFlags.actions = validateInputLength(
        await input({
          message: 'Enter the allowed actions, separated by spaces. Use * to allow all actions',
          default: '*',
        }),
        INPUT_LIMIT,
      )
    }

    return flagsSchema.parse(promptFlags)
  }
}
