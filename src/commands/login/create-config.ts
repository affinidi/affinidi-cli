import { readFileSync } from 'fs'
import { input } from '@inquirer/prompts'
import { Flags, ux } from '@oclif/core'
import { CLIError } from '@oclif/core/lib/errors'
import z from 'zod'
import { BaseCommand, IdTokenClaimFormats } from '../../common'
import { clientSDK } from '../../services/affinidi'
import { vpAdapterService } from '../../services/affinidi/vp-adapter'
import {
  CreateLoginConfigurationInput,
  CreateLoginConfigurationOutput,
  TokenEndpointAuthMethod,
} from '../../services/affinidi/vp-adapter/vp-adapter.api'

export class CreateConfig extends BaseCommand<typeof CreateConfig> {
  static summary = 'Creates a login configuration in your active project'
  static examples = [
    '<%= config.bin %> <%= command.id %>',
    '<%= config.bin %> <%= command.id %> -f loginConfig.json',
    '<%= config.bin %> <%= command.id %> -n MyLoginConfig -u http://localhost:8080/callback',
    '<%= config.bin %> <%= command.id %> --name "My Login Config" --redirect-uris "https://my-fancy-project.eu.auth0.com/login/callback http://localhost:8080/callback" --token-endpoint-auth-method client_secret_post --claim-format array --scope "my_user_group my_other_group" --client-name "My App Name" --client-origin http://localhost:8080 --client-logo http://localhost:8080/logo',
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
      const rawData = readFileSync(flags.file, 'utf8')
      try {
        data = JSON.parse(rawData)
      } catch (error) {
        throw new CLIError(`Provided file is not a valid JSON\n${(error as Error).message}`)
      }
    }
    // Flag/prompt input
    else {
      data = {
        name: flags.name ?? (await input({ message: 'Enter the login configuration name' })),
        redirectUris: (
          flags['redirect-uris'] ?? (await input({ message: 'Enter the OAuth 2.0 redirect URIs, separated by space' }))
        ).split(' '),
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
      name: z.string().min(1),
      redirectUris: z.string().url().array(),
      // TODO improve Presentation Definition validation
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
          name: z.string(),
          origin: z.string(),
          logo: z.string(),
        })
        .optional(),
      tokenEndpointAuthMethod: z.nativeEnum(TokenEndpointAuthMethod).optional(),
    })
    const createLoginConfigInput = createConfigSchema.parse(data)

    ux.action.start('Creating login configuration')
    const createConfigOutput = await vpAdapterService.createLoginConfig(
      clientSDK.config.getProjectToken()?.projectAccessToken,
      createLoginConfigInput,
    )
    ux.action.stop('Created successfully!')

    this.warn(
      this.chalk.red.bold('Please save the clientSecret somewhere safe. You will not be able to view it again.'),
    )

    if (!this.jsonEnabled()) this.logJson(createConfigOutput)
    return createConfigOutput
  }
}
