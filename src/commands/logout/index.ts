import { Command, CliUx } from '@oclif/core'

import { confirmSignOut } from '../../user-actions'
import { userManagementService, vaultService } from '../../services'
import { SignoutError, getErrorOutput, CliError } from '../../errors'
import { getSession } from '../../services/user-management'

export default class Logout extends Command {
  static command = 'affinidi logout'
  static description = 'Use this command to end your affinidi session'

  static examples = ['<%= config.bin %> <%= command.id %>']

  public async run(): Promise<void> {
    const answer = await confirmSignOut()
    if (answer !== 'y') {
      await CliUx.ux.done()
      return
    }

    const token = getSession()?.accessToken

    if (!token) {
      CliUx.ux.error(SignoutError)
    }

    await userManagementService.signout({ token })
    vaultService.clear()

    CliUx.ux.info("Thank you for using Affinidi's services")
  }

  async catch(error: CliError) {
    CliUx.ux.info(getErrorOutput(error, Logout.command, Logout.command, Logout.description))
  }
}
