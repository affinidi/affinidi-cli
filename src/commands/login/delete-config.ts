import { ux, Flags } from '@oclif/core'
import { BaseCommand } from '../../common'
import { promptRequiredParameters } from '../../helpers'
import { clientSDK } from '../../services/affinidi'
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

    ux.action.start('Deleting login configuration')
    await vpAdapterService.deleteLoginConfigurationById(
      clientSDK.config.getProjectToken()?.projectAccessToken,
      promptFlags.id,
    )
    ux.action.stop('Deleted successfully!')

    if (!this.jsonEnabled()) this.logJson({ id: promptFlags.id })
    return { id: promptFlags.id }
  }
}
