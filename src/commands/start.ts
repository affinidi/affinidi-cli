import { ux } from '@oclif/core'
import { BaseCommand } from '../common'
import { bffService } from '../services/affinidi/bff-service'

export class Start extends BaseCommand<typeof Start> {
  static summary = 'Log in to Affinidi'
  static examples = ['<%= config.bin %> <%= command.id %>']

  public async run(): Promise<void> {
    ux.action.start('Authenticating in browser')
    try {
      await bffService.login()
      ux.action.stop('Authenticated successfully!')
    } catch (error) {
      ux.action.stop('Authentication failed!')
      this.error(error as string)
    }
  }
}
