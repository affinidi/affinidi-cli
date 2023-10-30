import { ux, Flags } from '@oclif/core'
import z from 'zod'
import { BaseCommand } from '../../common'
import { promptRequiredParameters } from '../../common/prompts'
import { INPUT_LIMIT } from '../../common/validators'
import { clientSDK } from '../../services/affinidi'
import { vpAdapterService } from '../../services/affinidi/vp-adapter'

export class DeleteGroup extends BaseCommand<typeof DeleteGroup> {
  static summary = 'Deletes a user group from your active project'
  static examples = [
    '<%= config.bin %> <%= command.id %> -n my_group',
    '<%= config.bin %> <%= command.id %> --name my_group',
  ]
  static flags = {
    name: Flags.string({
      char: 'n',
      summary: 'Name of the user group',
    }),
  }

  public async run(): Promise<{ name: string }> {
    const { flags } = await this.parse(DeleteGroup)
    const promptFlags = await promptRequiredParameters(['name'], flags)
    const schema = z.object({
      name: z.string().max(INPUT_LIMIT),
    })
    const validatedFlags = schema.parse(promptFlags)

    ux.action.start('Deleting user group')
    await vpAdapterService.deleteGroup(clientSDK.config.getProjectToken()?.projectAccessToken, validatedFlags.name)
    ux.action.stop('Deleted successfully!')

    if (!this.jsonEnabled()) this.logJson({ name: validatedFlags.name })
    return { name: validatedFlags.name }
  }
}
