import { ListConfigurationOK } from '@affinidi-tdk/iota-client'
import { ux } from '@oclif/core'
import { BaseCommand } from '../../common/base-command.js'
import { iotaService } from '../../services/affinidi/iota/service.js'

export class ListIotaConfigs extends BaseCommand<typeof ListIotaConfigs> {
  static summary = 'Lists Affinidi Iota Framework configurations in your active project'
  static examples = ['<%= config.bin %> <%= command.id %>']

  public async run(): Promise<ListConfigurationOK> {
    ux.action.start('Fetching Affinidi Iota Framework configurations')
    const output = await iotaService.listIotaConfigurations()
    ux.action.stop('Fetched successfully!')

    if (!this.jsonEnabled()) this.logJson(output)
    return output
  }
}
