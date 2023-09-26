import { ux, Flags } from '@oclif/core'
import { BaseCommand } from '../../common'
import { promptRequiredParameters } from '../../helpers'
import { clientSDK } from '../../services/affinidi'
import { vpAdapterService } from '../../services/affinidi/vp-adapter'
import { GroupUserMappingsList } from '../../services/affinidi/vp-adapter/vp-adapter.api'

export class ListUsersInGroup extends BaseCommand<typeof ListUsersInGroup> {
  static summary = 'Use this command to list users in the user group'
  static examples = ['<%= config.bin %> <%= command.id %> --group-name my_group']
  static flags = {
    'group-name': Flags.string({
      summary: 'Name of the user group',
    }),
  }

  public async run(): Promise<GroupUserMappingsList> {
    const { flags } = await this.parse(ListUsersInGroup)
    const promptFlags = await promptRequiredParameters(['group-name'], flags)

    ux.action.start('Fetching users in the user group')
    const listGroupUsersOutput = await vpAdapterService.listGroupUsers(
      clientSDK.config.getProjectToken()?.projectAccessToken,
      promptFlags['group-name'],
    )
    ux.action.stop('Fetched successfully!')

    if (!this.jsonEnabled()) this.logJson(listGroupUsersOutput)
    return listGroupUsersOutput
  }
}
