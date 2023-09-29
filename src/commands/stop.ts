import confirm from '@inquirer/confirm'
import { ux } from '@oclif/core'
import { CLIError } from '@oclif/core/lib/errors'
import { BaseCommand } from '../common'
import { clientSDK } from '../services/affinidi'

export class Stop extends BaseCommand<typeof Stop> {
  static summary = 'Log out from Affinidi'
  static examples = ['<%= config.bin %> <%= command.id %>']

  public async run(): Promise<void> {
    const { flags } = await this.parse(Stop)
    const userToken = clientSDK.config.getUserToken()
    if (!userToken) {
      this.warn('You are not logged in')
      return
    }

    if (!flags['no-input']) {
      const stop = await confirm({
        message: 'Are you sure that you want to log out from Affinidi',
      })
      if (!stop) throw new CLIError('Action canceled')
    }

    ux.action.start('Logging out')
    await clientSDK.logout()
    ux.action.stop('Logged out successfully!')
  }
}
