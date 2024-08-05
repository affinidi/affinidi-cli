import { ux } from '@oclif/core'
import { BaseCommand } from '../../common/base-command.js'
import { vpAdapterService } from '../../services/affinidi/vp-adapter/service.js'
import { GroupsList } from '../../services/affinidi/vp-adapter/vp-adapter.api.js'

export class ListGroups extends BaseCommand<typeof ListGroups> {
  static summary = 'Lists user groups in your active project'
  static examples = ['<%= config.bin %> <%= command.id %>']

  public async run(): Promise<GroupsList> {
    ux.action.start('Fetching user groups')
    const listGroupsOutput = await vpAdapterService.listGroups()
    ux.action.stop('Fetched successfully!')

    if (!this.jsonEnabled()) this.logJson(listGroupsOutput)
    return listGroupsOutput
  }
}
