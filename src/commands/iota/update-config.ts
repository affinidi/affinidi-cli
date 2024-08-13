import { UpdateConfigurationByIdInput, IotaConfigurationDto } from '@affinidi-tdk/iota-client'
import { ux, Flags } from '@oclif/core'
import z from 'zod'
import { BaseCommand } from '../../common/base-command.js'
import { promptRequiredParameters } from '../../common/prompts.js'
import { INPUT_LIMIT } from '../../common/validators.js'
import { iotaService } from '../../services/affinidi/iota/service.js'

export class UpdateIotaConfig extends BaseCommand<typeof UpdateIotaConfig> {
  static summary = 'Updates Iota configuration in your active project'
  static examples = [
    '<%= config.bin %> <%= command.id %> -i <value>',
    '<%= config.bin %> <%= command.id %> --id <value>',
  ]
  static flags = {
    id: Flags.string({
      char: 'i',
      summary: 'ID of the Iota configuration',
    }),
    name: Flags.string({
      char: 'n',
      summary: 'Name of the Iota configuration',
    }),
  }

  public async run(): Promise<IotaConfigurationDto> {
    const { flags } = await this.parse(UpdateIotaConfig)
    const promptFlags = await promptRequiredParameters(['id'], flags)

    let data: UpdateConfigurationByIdInput = {}

    data = {
      name: promptFlags.name,
    }

    const schema = z.object({
      id: z.string().max(INPUT_LIMIT),
      name: z.string().min(1).max(INPUT_LIMIT).optional(),
    })
    const validatedFlags = schema.parse(promptFlags)

    ux.action.start('Updating Iota configurations')
    const output = await iotaService.updateIotaConfigById(validatedFlags.id, data)
    ux.action.stop('Updated successfully!')

    if (!this.jsonEnabled()) this.logJson(output)
    return output
  }
}
