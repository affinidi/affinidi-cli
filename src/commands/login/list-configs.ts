import { ListLoginConfigurationOutput } from '@affinidi-tdk/login-configuration-client'
import { ux } from '@oclif/core'
import { BaseCommand } from '../../common/base-command.js'
import { vpAdapterService } from '../../services/affinidi/vp-adapter/service.js'

export class ListLoginConfigurations extends BaseCommand<typeof ListLoginConfigurations> {
  static summary = 'Lists login configurations in your active project'
  static examples = ['<%= config.bin %> <%= command.id %>']

  public async run(): Promise<ListLoginConfigurationOutput> {
    ux.action.start('Fetching login configurations')
    const listLoginConfigOutput = await vpAdapterService.listLoginConfigurations()
    ux.action.stop('Fetched successfully!')

    if (!this.jsonEnabled()) this.logJson(listLoginConfigOutput)
    return listLoginConfigOutput
  }
}
