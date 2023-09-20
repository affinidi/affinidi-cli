import { ux } from '@oclif/core'
import { BaseCommand } from '../../common'
import { clientSDK } from '../../services/affinidi'
import { vpAdapterService } from '../../services/affinidi/vp-adapter'
import { GroupsList } from '../../services/affinidi/vp-adapter/vp-adapter.api'

export class ListGroups extends BaseCommand<typeof ListGroups> {
  static summary = 'Lists user groups in your active project'
  static examples = ['<%= config.bin %> <%= command.id %>']

  public async run(): Promise<GroupsList> {
    ux.action.start('Fetching user groups')
    const listGroupsOutput = await vpAdapterService.listGroups(clientSDK.config.getProjectToken()?.projectAccessToken)
    ux.action.stop('Fetched successfully!')

    if (!this.jsonEnabled()) this.logJson(listGroupsOutput)
    return listGroupsOutput
  }
}
