import { readFile } from 'fs/promises'
import { input } from '@inquirer/prompts'
import { Flags, ux } from '@oclif/core'
import { CLIError } from '@oclif/core/lib/errors'
import z from 'zod'
import { BaseCommand, IdTokenClaimFormats } from '../../common'
import { giveFlagInputErrorMessage } from '../../common/error-messages'
import { INPUT_LIMIT, validateInputLength } from '../../common/validators'
import { bffService } from '../../services/affinidi/bff-service'
import {
  TokenEndpointAuthMethod,
  CreateLoginConfigurationOutput,
} from '../../services/affinidi/vp-adapter/vp-adapter.api'

export class ImportLoginConfigs extends BaseCommand<typeof ImportLoginConfigs> {
  static summary = 'Import login configurations in your active project'
  static examples = [
    '<%= config.bin %> <%= command.id %>',
    '<%= config.bin %> <%= command.id %> --path "../my-configs.json"',
  ]

  static flags = {
    path: Flags.string({
      char: 'p',
      summary: 'Path to file with configurations that should be imported',
    }),
  }

  public async run(): Promise<{ configurations: CreateLoginConfigurationOutput[] }> {
    const { flags } = await this.parse(ImportLoginConfigs)

    if (flags['no-input']) {
      if (!flags.path) throw new CLIError(giveFlagInputErrorMessage('path'))
    }

    const path =
      flags.path ??
      validateInputLength(
        await input({ message: 'Enter path to file with login configurations to import' }),
        INPUT_LIMIT,
      )

    const rawData = await readFile(path, 'utf8')
    const rawDataJson = JSON.parse(rawData)

    const configSchema = z.object({
      name: z.string().min(1).max(INPUT_LIMIT),
      redirectUris: z.string().max(INPUT_LIMIT).url().array(),
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

    const configsSchema = z.array(configSchema)
    configsSchema.parse(rawDataJson.data.configurations)

    ux.action.start('Importing login configurations')
    const importLoginConfigOutput = await bffService.importLoginConfigs(rawDataJson.data)
    ux.action.stop('Imported successfully!')

    this.warn(
      this.chalk.red.bold('Please save the clientSecret somewhere safe. You will not be able to view it again.'),
    )

    if (!this.jsonEnabled()) this.logJson(importLoginConfigOutput)
    return importLoginConfigOutput
  }
}
