import confirm from '@inquirer/confirm'
import { ux } from '@oclif/core'
import { CLIError } from '@oclif/core/lib/errors'
import { BaseCommand } from '../common'
import { credentialsVault } from '../services/credentials-vault'
import { bffService } from '../services/affinidi/bff-service'

export class Stop extends BaseCommand<typeof Stop> {
  static summary = 'Log out from Affinidi'
  static examples = ['<%= config.bin %> <%= command.id %>']

  public async run(): Promise<void> {
    const { flags } = await this.parse(Stop)
    const sessionId = credentialsVault.getSessionId()
    if (!sessionId) {
      this.warn('You are not logged in')
      return
    }

    if (!flags['no-input']) {
      const stop = await confirm({
        message:
          'Are you sure that you want to log out from Affinidi? Type "n" if you wish to continue using Affinidi CLI, type anything else to log out',
      })
      if (!stop) throw new CLIError('Action canceled')
    }

    ux.action.start('Logging out')
    await bffService.logout()
    ux.action.stop('Logged out successfully!')
  }
}
