import { ux } from '@oclif/core'
import { BaseCommand } from '../common'
import { bffService } from '../services/affinidi/bff-service'

export class WhoAmI extends BaseCommand<typeof WhoAmI> {
  static summary = "Returns user's subject, projects, and token details from the current session."
  static examples = ['<%= config.bin %> <%= command.id %>']

  public async run() {
    ux.action.start('Retrieving user data')
    const data = await bffService.whoami()
    ux.action.stop('Retrieved successfully!')
    if (!this.jsonEnabled()) this.logJson(data)
    return data
  }
}
