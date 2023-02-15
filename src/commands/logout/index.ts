import { Command, ux } from '@oclif/core'
import { StatusCodes } from 'http-status-codes'

import { confirmSignOut } from '../../user-actions'
import { vaultService } from '../../services/vault/typedVaultService'
import { userManagementService, configService } from '../../services'
import { SignoutError, getErrorOutput, CliError, Unauthorized } from '../../errors'
import { getSession } from '../../services/user-management'
import { EventDTO } from '../../services/analytics/analytics.api'
import { analyticsService, generateUserMetadata } from '../../services/analytics'
import { isAuthenticated } from '../../middleware/authentication'
import { DisplayOptions, displayOutput } from '../../middleware/display'
import { checkErrorFromWizard } from '../../wizard/helpers'
import { output } from '../../customFlags/outputFlag'

export default class Logout extends Command {
  static command = 'affinidi logout'

  static description = 'Use this command to end your affinidi session'

  static examples = ['<%= config.bin %> <%= command.id %>']

  static flags = {
    output,
  }

  public async run(): Promise<void> {
    const { flags } = await this.parse(Logout)
    if (!isAuthenticated()) {
      throw new CliError(Unauthorized, StatusCodes.UNAUTHORIZED, 'iAm')
    }
    const answer = await confirmSignOut()
    if (answer !== 'y') {
      await ux.done()
      return
    }
    const { account, consoleAuthToken } = getSession()
    const token = consoleAuthToken
    const analyticsData: EventDTO = {
      name: 'CONSOLE_USER_SIGN_OUT',
      category: 'APPLICATION',
      component: 'Cli',
      uuid: account.userId,
      metadata: {
        commandId: 'affinidi.logout',
        ...generateUserMetadata(account.label),
      },
    }

    if (!token) {
      throw new CliError(SignoutError, 0, 'userManagement')
    }

    await userManagementService.signout({ token })
    vaultService.clear()
    await analyticsService.eventsControllerSend(analyticsData)
    displayOutput({ itemToDisplay: "Thank you for using Affinidi's services", flag: flags.output })
  }

  async catch(error: CliError) {
    if (checkErrorFromWizard(error)) throw error
    const outputFormat = configService.getOutputFormat()
    const optionsDisplay: DisplayOptions = {
      itemToDisplay: getErrorOutput(
        error,
        Logout.command,
        Logout.command,
        Logout.description,
        outputFormat !== 'plaintext',
      ),
      err: true,
    }
    try {
      const { flags } = await this.parse(Logout)
      optionsDisplay.flag = flags.output
      displayOutput(optionsDisplay)
    } catch (_) {
      displayOutput(optionsDisplay)
    }
  }
}
