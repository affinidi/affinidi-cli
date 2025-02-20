import { readFile } from 'fs/promises'
import {
  LoginConfigurationObject,
  TokenEndpointAuthMethod,
  UpdateLoginConfigurationInput,
} from '@affinidi-tdk/login-configuration-client'
import { Flags, ux } from '@oclif/core'
import { CLIError } from '@oclif/core/errors'
import z from 'zod'
import { BaseCommand } from '../../common/base-command.js'
import { promptRequiredParameters } from '../../common/prompts.js'
import { INPUT_LIMIT, PRESENTATION_DEFINITION_LIMIT, split, validateInputLength } from '../../common/validators.js'
import { vpAdapterService } from '../../services/affinidi/vp-adapter/service.js'

export class UpdateLoginConfiguration extends BaseCommand<typeof UpdateLoginConfiguration> {
  static summary = 'Updates a login configuration'
  static examples = [
    '<%= config.bin %> <%= command.id %> --id <value> -f loginConfig.json',
    '<%= config.bin %> <%= command.id %> --id <value> -u http://localhost:8080/callback',
    '<%= config.bin %> <%= command.id %> --id <value> --name "My Login Config" --redirect-uris "https://my-fancy-project.eu.auth0.com/login/callback http://localhost:8080/callback" --token-endpoint-auth-method client_secret_post --client-name "My App Name" --client-origin http://localhost:8080 --client-logo http://localhost:8080/logo',
  ]
  static flags = {
    id: Flags.string({
      char: 'i',
      summary: 'ID of the login configuration',
    }),
    file: Flags.string({
      char: 'f',
      summary: 'Location of a json file containing login configuration data',
      exclusive: ['name', 'redirect-uris', 'token-endpoint-auth-method', 'client-name', 'client-origin', 'client-logo'],
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

  public async run(): Promise<LoginConfigurationObject> {
    const { flags } = await this.parse(UpdateLoginConfiguration)
    const promptFlags = await promptRequiredParameters(['id'], flags)
    promptFlags.id = validateInputLength(promptFlags.id, INPUT_LIMIT)

    let data: UpdateLoginConfigurationInput = {}
    // File input
    if (promptFlags.file) {
      const rawData = await readFile(promptFlags.file, 'utf8')
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
      data = {
        name: promptFlags.name,
        redirectUris: promptFlags['redirect-uris'] ? split(promptFlags['redirect-uris'], ' ') : undefined,
        tokenEndpointAuthMethod: promptFlags['token-endpoint-auth-method'],
      }
      if (promptFlags['client-name'] || promptFlags['client-origin'] || promptFlags['client-logo']) {
        data.clientMetadata = {
          name: promptFlags['client-name'] ?? '',
          origin: promptFlags['client-origin'] ?? '',
          logo: promptFlags['client-logo'] ?? '',
        }
      }
    }

    const updateConfigSchema = z.object({
      name: z.string().min(1).max(INPUT_LIMIT).optional(),
      redirectUris: z.string().max(INPUT_LIMIT).url().array().min(1).optional(),
      presentationDefinition: z.object({}).passthrough().optional(),
      idTokenMapping: z
        .object({
          sourceField: z.string(),
          idTokenClaim: z.string(),
        })
        .array()
        .optional(),
      clientMetadata: z
        .object({
          name: z.string().max(INPUT_LIMIT),
          origin: z.string().max(INPUT_LIMIT),
          logo: z.string().max(INPUT_LIMIT),
        })
        .optional(),
      tokenEndpointAuthMethod: z.nativeEnum(TokenEndpointAuthMethod).optional(),
    })
    const updateLoginConfigInput = updateConfigSchema.parse(data)

    ux.action.start('Updating login configuration')
    const updateLoginConfigOutput = await vpAdapterService.updateLoginConfigurationById(
      promptFlags.id,
      updateLoginConfigInput,
    )
    ux.action.stop('Updated successfully!')

    if (!this.jsonEnabled()) this.logJson(updateLoginConfigOutput)
    return updateLoginConfigOutput
  }
}
