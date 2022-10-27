import { Command, CliUx } from '@oclif/core'

import { confirmSignOut } from '../../user-actions'
import { SESSION_TOKEN_KEY_NAME, userManagementService, vaultService } from '../../services'
import { SingoutError } from '../../errors'

export default class Logout extends Command {
  static description = 'Use this command to end your affinidi session'

  static examples = ['<%= config.bin %> <%= command.id %>']

  public async run(): Promise<void> {
    const answer = await confirmSignOut()
    if (answer !== 'y') {
      await CliUx.ux.done()
      return
    }

    const token = await vaultService.get(SESSION_TOKEN_KEY_NAME)
    if (!token) {
      CliUx.ux.error(SingoutError)
    }

    await userManagementService.signout({ token })
    vaultService.clear()

    CliUx.ux.info("Thank you for using Affinidi's services")
  }

  async catch(error: string | Error) {
    CliUx.ux.info(`There was an error while trying to log you out. Please try again later.`)
    // CliUx.ux.info(`${error.toString()}`)
  }
}
