import { Command, CliUx } from '@oclif/core'
import { StatusCodes } from 'http-status-codes'

import { confirmSignOut } from '../../user-actions'
import { userManagementService, vaultService, VAULT_KEYS } from '../../services'
import { SignoutError, getErrorOutput, CliError, Unauthorized } from '../../errors'
import { getSession } from '../../services/user-management'
import { EventDTO } from '../../services/analytics/analytics.api'
import { analyticsService, generateUserMetadata } from '../../services/analytics'
import { isAuthenticated } from '../../middleware/authentication'
import { displayOutput } from '../../middleware/display'
import { configService } from '../../services/config'

export default class Logout extends Command {
  static command = 'affinidi logout'

  static description = 'Use this command to end your affinidi session'

  static examples = ['<%= config.bin %> <%= command.id %>']

  public async run(): Promise<void> {
    if (!isAuthenticated()) {
      throw new CliError(Unauthorized, StatusCodes.UNAUTHORIZED, 'iAm')
    }
    const answer = await confirmSignOut()
    if (answer !== 'y') {
      await CliUx.ux.done()
      return
    }
    const session = getSession()
    const token = session?.accessToken
    const analyticsData: EventDTO = {
      name: 'CONSOLE_USER_SIGN_OUT',
      category: 'APPLICATION',
      component: 'Cli',
      uuid: configService.getCurrentUser(),
      metadata: {
        commandId: 'affinidi.logout',
        ...generateUserMetadata(session?.account?.label),
      },
    }

    if (!token) {
      throw new CliError(SignoutError, 0, 'userManagement')
    }

    await userManagementService.signout({ token })
    vaultService.clear()
    await analyticsService.eventsControllerSend(analyticsData)
    displayOutput("Thank you for using Affinidi's services")
  }

  async catch(error: CliError) {
    const outputFormat = configService.getOutputFormat()
    CliUx.ux.info(
      getErrorOutput(
        error,
        Logout.command,
        Logout.command,
        Logout.description,
        outputFormat !== 'plaintext',
      ),
    )
  }
}
