import { WalletDto } from '@affinidi-tdk/wallets-client'
import { ux } from '@oclif/core'
import { BaseCommand } from '../../common/base-command.js'
import { cweService } from '../../services/affinidi/cwe/service.js'

export class ListWallets extends BaseCommand<typeof ListWallets> {
  static summary = 'Lists wallets in your active project'
  static examples = ['<%= config.bin %> <%= command.id %>']

  public async run(): Promise<WalletDto[]> {
    ux.action.start('Fetching wallets')
    const output = await cweService.listWallets()
    ux.action.stop('Fetched successfully!')

    if (!this.jsonEnabled()) this.logJson(output)
    return output
  }
}
