import { IotaConfigurationDto } from '@affinidi-tdk/iota-client'
import { ux, Flags } from '@oclif/core'
import { CLIError } from '@oclif/core/errors'
import z from 'zod'
import { BaseCommand } from '../../common/base-command.js'
import { giveFlagInputErrorMessage } from '../../common/error-messages.js'
import { promptRequiredParameters } from '../../common/prompts.js'
import { INPUT_LIMIT } from '../../common/validators.js'
import { iotaService } from '../../services/affinidi/iota/service.js'

export class GetIotaConfig extends BaseCommand<typeof GetIotaConfig> {
  static summary = 'Gets the details of Iota configuration in your active project'
  static examples = [
    '<%= config.bin %> <%= command.id %> -i <value>',
    '<%= config.bin %> <%= command.id %> --id <value>',
  ]
  static flags = {
    id: Flags.string({
      char: 'i',
      summary: 'ID of the Iota configuration',
    }),
  }

  public async run(): Promise<IotaConfigurationDto> {
    const { flags } = await this.parse(GetIotaConfig)
    const promptFlags = await promptRequiredParameters(['id'], flags)

    if (flags['no-input']) {
      if (!flags.id) throw new CLIError(giveFlagInputErrorMessage('id'))
    }

    const schema = z.object({
      id: z.string().max(INPUT_LIMIT),
    })
    const validatedFlags = schema.parse(promptFlags)

    ux.action.start('Fetching Iota configurations')
    const output = await iotaService.getIotaConfigById(validatedFlags.id)
    ux.action.stop('Fetched successfully!')

    if (!this.jsonEnabled()) this.logJson(output)
    return output
  }
}
