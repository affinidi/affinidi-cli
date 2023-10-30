import { ux } from '@oclif/core'
import { BaseCommand } from '../common'
import { bffClient } from '../services/affinidi/bff-client'

export class WhoAmI extends BaseCommand<typeof WhoAmI> {
  static summary = "Returns user's subject and principalId from his active session"
  static examples = ['<%= config.bin %> <%= command.id %>']

  public async run() {
    ux.action.start('Retrieving user data')
    const data = await bffClient.whoami()
    ux.action.stop('Retrieved successfully!')
    if (!this.jsonEnabled()) this.logJson(data)
    return data
  }
}
