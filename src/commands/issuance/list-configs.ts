import { IssuanceConfigListResponse } from '@affinidi-tdk/credential-issuance-client'
import { ux } from '@oclif/core'
import { BaseCommand } from '../../common/base-command.js'
import { issuanceService } from '../../services/affinidi/cis/service.js'

export class ListIssuanceConfigs extends BaseCommand<typeof ListIssuanceConfigs> {
  static summary = 'Lists credential issuance configurations in your active project'
  static examples = ['<%= config.bin %> <%= command.id %>']

  public async run(): Promise<IssuanceConfigListResponse> {
    ux.action.start('Fetching credential issuance configurations')
    const output = await issuanceService.listIssuanceConfigs()
    ux.action.stop('Fetched successfully!')

    if (!this.jsonEnabled()) this.logJson(output)
    return output
  }
}
