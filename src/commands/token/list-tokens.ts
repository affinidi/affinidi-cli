import { ux } from '@oclif/core'
import { BaseCommand } from '../../common'
import { clientSDK } from '../../services/affinidi'
import { iamService } from '../../services/affinidi/iam'
import { MachineUserDto } from '../../services/affinidi/iam/iam.api'

export class ListTokens extends BaseCommand<typeof ListTokens> {
  static summary = 'Lists your Personal Access Tokens (PATs)'
  static examples = ['<%= config.bin %> <%= command.id %>']

  public async run(): Promise<MachineUserDto[]> {
    ux.action.start('Fetching list of Personal Access Tokens')
    const out = await iamService.listM2MKeys(clientSDK.config.getUserToken()?.access_token)
    ux.action.stop('Fetched successfully!')

    if (!this.jsonEnabled()) this.logJson(out.machineUsers)
    return out.machineUsers
  }
}
