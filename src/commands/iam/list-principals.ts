import { ux } from '@oclif/core'
import chalk from 'chalk'
import { BaseCommand } from '../../common'
import { iamService } from '../../services/affinidi/iam'
import { UserList } from '../../services/affinidi/iam/iam.api'

export class ListPrincipals extends BaseCommand<typeof ListPrincipals> {
  static summary = 'Lists the principals (users and tokens) in the active project'
  static description = `To change your active project, use command ${chalk.inverse('affinidi project select-project')}`
  static examples = ['<%= config.bin %> <%= command.id %>']

  public async run(): Promise<UserList> {
    ux.action.start('Fetching project principals')
    const out = await iamService.listPrincipalsOfProject()
    ux.action.stop('Fetched successfully!')

    if (!this.jsonEnabled()) this.logJson(out)
    return out
  }
}
