import { ux, Flags } from '@oclif/core'
import z from 'zod'
import { BaseCommand } from '../../common/base-command.js'
import { promptRequiredParameters } from '../../common/prompts.js'
import { INPUT_LIMIT } from '../../common/constants.js'

import { iotaService } from '../../services/affinidi/iota/service.js'

export class DeleteIotaConfig extends BaseCommand<typeof DeleteIotaConfig> {
  static summary = 'Deletes Affinidi Iota Framework configuration from your active project'
  static examples = [
    '<%= config.bin %> <%= command.id %> -i <value>',
    '<%= config.bin %> <%= command.id %> --id <value>',
  ]
  static flags = {
    id: Flags.string({
      char: 'i',
      summary: 'ID of the Affinidi Iota Framework configuration',
    }),
  }

  public async run(): Promise<{ id: string }> {
    const { flags } = await this.parse(DeleteIotaConfig)
    const promptFlags = await promptRequiredParameters(['id'], flags)

    const schema = z.object({
      id: z.string().max(INPUT_LIMIT),
    })
    const validatedFlags = schema.parse(promptFlags)

    ux.action.start('Deleting Affinidi Iota Framework configuration')
    await iotaService.deleteIotaConfigById(validatedFlags.id)
    ux.action.stop('Deleted successfully!')

    if (!this.jsonEnabled()) this.logJson({ id: validatedFlags.id })
    return { id: validatedFlags.id }
  }
}
