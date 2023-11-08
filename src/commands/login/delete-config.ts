import { ux, Flags } from '@oclif/core'
import z from 'zod'
import { BaseCommand } from '../../common'
import { promptRequiredParameters } from '../../common/prompts'
import { INPUT_LIMIT } from '../../common/validators'
import { vpAdapterService } from '../../services/affinidi/vp-adapter'

export class DeleteLoginConfiguration extends BaseCommand<typeof DeleteLoginConfiguration> {
  static summary = 'Deletes a login configuration from your active project'
  static examples = [
    '<%= config.bin %> <%= command.id %> -i <value>',
    '<%= config.bin %> <%= command.id %> --id <value>',
  ]
  static flags = {
    id: Flags.string({
      char: 'i',
      summary: 'ID of the login configuration',
    }),
  }

  public async run(): Promise<{ id: string }> {
    const { flags } = await this.parse(DeleteLoginConfiguration)
    const promptFlags = await promptRequiredParameters(['id'], flags)
    const schema = z.object({
      id: z.string().max(INPUT_LIMIT),
    })
    const validatedFlags = schema.parse(promptFlags)

    ux.action.start('Deleting login configuration')
    await vpAdapterService.deleteLoginConfigurationById(validatedFlags.id)
    ux.action.stop('Deleted successfully!')

    if (!this.jsonEnabled()) this.logJson({ id: validatedFlags.id })
    return { id: validatedFlags.id }
  }
}
