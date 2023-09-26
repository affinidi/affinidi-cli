import { ux, Flags } from '@oclif/core'
import { BaseCommand } from '../../common'
import { promptRequiredParameters } from '../../helpers'
import { clientSDK } from '../../services/affinidi'
import { vpAdapterService } from '../../services/affinidi/vp-adapter'

export class RemoveUserFromGroup extends BaseCommand<typeof RemoveUserFromGroup> {
  static summary = 'Removes a user from a user group'
  static examples = ['<%= config.bin %> <%= command.id %> --group-name my_group --user-mapping-id <value>']
  static flags = {
    'group-name': Flags.string({
      summary: 'Name of the user group',
    }),
    'user-mapping-id': Flags.string({
      summary: 'ID of the user mapping record',
    }),
  }

  public async run(): Promise<{ groupName: string; userMappingId: string }> {
    const { flags } = await this.parse(RemoveUserFromGroup)
    const promptFlags = await promptRequiredParameters(['group-name', 'user-mapping-id'], flags)

    ux.action.start('Removing user from group')
    await vpAdapterService.removeUserFromGroup(
      clientSDK.config.getProjectToken()?.projectAccessToken,
      promptFlags['group-name'],
      promptFlags['user-mapping-id'],
    )
    ux.action.stop('Removed successfully!')

    const response = { groupName: promptFlags['group-name'], userMappingId: promptFlags['user-mapping-id'] }
    if (!this.jsonEnabled()) this.logJson(response)
    return response
  }
}
