import { Command, CliUx, Flags } from '@oclif/core'
import { StatusCodes } from 'http-status-codes'

import { confirmSignOut } from '../../user-actions'
import { userManagementService, vaultService } from '../../services'
import { SignoutError, getErrorOutput, CliError, Unauthorized } from '../../errors'
import { getSession } from '../../services/user-management'
import { EventDTO } from '../../services/analytics/analytics.api'
import { analyticsService, generateUserMetadata } from '../../services/analytics'
import { isAuthenticated } from '../../middleware/authentication'
import { displayOutput } from '../../middleware/display'
import { configService } from '../../services/config'
import { ViewFormat } from '../../constants'

export default class Logout extends Command {
  static command = 'affinidi logout'

  static description = 'Use this command to end your affinidi session'

  static examples = ['<%= config.bin %> <%= command.id %>']

  static flags = {
    view: Flags.enum<ViewFormat>({
      char: 'v',
      description: 'set flag to override default output format view',
      options: ['plaintext', 'json'],
    }),
  }

  public async run(): Promise<void> {
    const { flags } = await this.parse(Logout)
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
    displayOutput("Thank you for using Affinidi's services", flags.view)
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
