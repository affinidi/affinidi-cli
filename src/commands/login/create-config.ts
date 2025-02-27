import { readFile } from 'fs/promises'
import {
  CreateLoginConfigurationInput,
  CreateLoginConfigurationOutput,
  TokenEndpointAuthMethod,
} from '@affinidi-tdk/login-configuration-client'
import { input } from '@inquirer/prompts'
import { Flags, ux } from '@oclif/core'
import { CLIError } from '@oclif/core/errors'
import z from 'zod'
import { BaseCommand } from '../../common/base-command.js'
import { IdTokenClaimFormats } from '../../common/constants.js'
import { giveFlagInputErrorMessage } from '../../common/error-messages.js'
import { INPUT_LIMIT, PRESENTATION_DEFINITION_LIMIT, split, validateInputLength } from '../../common/validators.js'
import { vpAdapterService } from '../../services/affinidi/vp-adapter/service.js'

export class CreateConfig extends BaseCommand<typeof CreateConfig> {
  static summary = 'Creates a login configuration in your active project'
  static examples = [
    '<%= config.bin %> <%= command.id %>',
    '<%= config.bin %> <%= command.id %> -f loginConfig.json',
    '<%= config.bin %> <%= command.id %> -n MyLoginConfig -u http://localhost:8080/callback',
    '<%= config.bin %> <%= command.id %> --name "My Login Config" --redirect-uris "https://my-fancy-project.eu.auth0.com/login/callback http://localhost:8080/callback" --token-endpoint-auth-method client_secret_post --claim-format array --client-name "My App Name" --client-origin http://localhost:8080 --client-logo http://localhost:8080/logo',
  ]
  static flags = {
    file: Flags.string({
      char: 'f',
      summary: 'Location of a json file containing login configuration data',
      exclusive: [
        'name',
        'redirect-uris',
        'token-endpoint-auth-method',
        'claim-format',
        'client-name',
        'client-origin',
        'client-logo',
      ],
    }),
    name: Flags.string({
      char: 'n',
      summary: 'Name of the login configuration',
    }),
    'redirect-uris': Flags.string({
      char: 'u',
      summary: 'OAuth 2.0 redirect URIs, separated by space',
    }),
    'token-endpoint-auth-method': Flags.custom<TokenEndpointAuthMethod>({
      summary: 'Client authentication method for the token endpoint. Defaults to client_secret_post',
      description: `The options are:\n\
        client_secret_post: (default) Send client_id and client_secret as application/x-www-form-urlencoded in the HTTP body\n\
        client_secret_basic: Send client_id and client_secret as application/x-www-form-urlencoded encoded in the HTTP Authorization header\n\
        none: For public clients (native/mobile apps) which can not have a secret`,
      options: Object.values(TokenEndpointAuthMethod),
    })(),
    'claim-format': Flags.custom<IdTokenClaimFormats>({
      summary: 'ID token claims output format. Defaults to array',
      options: Object.values(IdTokenClaimFormats),
    })(),
    'client-name': Flags.string({
      summary: 'Name of the client, displayed in the consent page',
      dependsOn: ['client-origin', 'client-logo'],
    }),
    'client-origin': Flags.string({
      summary: 'Origin of the client, displayed in the consent page',
      dependsOn: ['client-name', 'client-logo'],
    }),
    'client-logo': Flags.string({
      summary: 'URL of a logo for the client, displayed in the consent page',
      dependsOn: ['client-name', 'client-origin'],
    }),
  }

  public async run(): Promise<CreateLoginConfigurationOutput> {
    const { flags } = await this.parse(CreateConfig)

    let data: CreateLoginConfigurationInput
    // File input
    if (flags.file) {
      const rawData = await readFile(flags.file, 'utf8')
      try {
        data = JSON.parse(rawData)
        if (data.presentationDefinition) {
          validateInputLength(JSON.stringify(data.presentationDefinition), PRESENTATION_DEFINITION_LIMIT)
        }
      } catch (error) {
        throw new CLIError(`Provided file is not a valid JSON\n${(error as Error).message}`)
      }
    }
    // Flag/prompt input
    else {
      if (flags['no-input']) {
        if (!flags.name) throw new CLIError(giveFlagInputErrorMessage('name'))
        if (!flags['redirect-uris']) throw new CLIError(giveFlagInputErrorMessage('redirect-uris'))
      }
      data = {
        name:
          flags.name ??
          validateInputLength(await input({ message: 'Enter the login configuration name' }), INPUT_LIMIT),
        redirectUris: split(
          flags['redirect-uris'] ??
            validateInputLength(
              await input({ message: 'Enter the OAuth 2.0 redirect URIs, separated by space' }),
              INPUT_LIMIT,
            ),
          ' ',
        ),
        claimFormat: flags['claim-format'],
        tokenEndpointAuthMethod: flags['token-endpoint-auth-method'],
      }
      if (flags['client-name'] || flags['client-origin'] || flags['client-logo']) {
        data.clientMetadata = {
          name: flags['client-name'] ?? '',
          origin: flags['client-origin'] ?? '',
          logo: flags['client-logo'] ?? '',
        }
      }
    }

    const createConfigSchema = z.object({
      name: z.string().min(1).max(INPUT_LIMIT),
      redirectUris: z.string().max(INPUT_LIMIT).url().array().min(1),
      presentationDefinition: z.object({}).passthrough().optional(),
      idTokenMapping: z
        .object({
          sourceField: z.string(),
          idTokenClaim: z.string(),
        })
        .array()
        .optional(),
      claimFormat: z.nativeEnum(IdTokenClaimFormats).optional(),
      clientMetadata: z
        .object({
          name: z.string().max(INPUT_LIMIT),
          origin: z.string().max(INPUT_LIMIT),
          logo: z.string().max(INPUT_LIMIT),
        })
        .optional(),
      tokenEndpointAuthMethod: z.nativeEnum(TokenEndpointAuthMethod).optional(),
    })
    const createLoginConfigInput = createConfigSchema.parse(data)

    ux.action.start('Creating login configuration')
    const createConfigOutput = await vpAdapterService.createLoginConfig(createLoginConfigInput)
    ux.action.stop('Created successfully!')

    this.warn(
      this.chalk.red.bold('Please save the clientSecret somewhere safe. You will not be able to view it again.'),
    )

    if (!this.jsonEnabled()) this.logJson(createConfigOutput)
    return createConfigOutput
  }
}
