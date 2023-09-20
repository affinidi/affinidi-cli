import { ux, Flags } from '@oclif/core'
import { BaseCommand } from '../../common'
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
      required: true,
    }),
  }

  public async run(): Promise<{ id: string }> {
    const { flags } = await this.parse(DeleteLoginConfiguration)

    ux.action.start('Deleting login configuration')
    await vpAdapterService.deleteLoginConfigurationById(
      clientSDK.config.getProjectToken()?.projectAccessToken,
      flags.id,
    )
    ux.action.stop('Deleted successfully!')

    if (!this.jsonEnabled()) this.logJson({ id: flags.id })
    return { id: flags.id }
  }
}
