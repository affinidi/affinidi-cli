import { Command, Flags, CliUx } from '@oclif/core'
import { StatusCodes } from 'http-status-codes'

import { displayOutput, DisplayOptions } from '../../middleware/display'
import { ViewFormat } from '../../constants'

import { configService, userManagementService } from '../../services'
import { getSession } from '../../services/user-management'
import { CliError, Unauthorized, getErrorOutput } from '../../errors'
import { EventDTO } from '../../services/analytics/analytics.api'
import { analyticsService, generateUserMetadata } from '../../services/analytics'
import { isAuthenticated } from '../../middleware/authentication'

export default class ShowUser extends Command {
  static command = 'affinidi show user'

  static usage = 'show user'

  static description = 'Shows info about logged-in user.'

  static examples = ['<%= config.bin %> <%= command.id %>']

  static flags = {
    output: Flags.enum<ViewFormat>({
      char: 'o',
      description: 'set flag to override default output format view',
      options: ['plaintext', 'json'],
    }),
  }

  public async run(): Promise<void> {
    const { flags } = await this.parse(ShowUser)
    if (!isAuthenticated()) {
      throw new CliError(Unauthorized, StatusCodes.UNAUTHORIZED, 'userManagement')
    }
    const { consoleAuthToken: token, account } = getSession()
    const analyticsData: EventDTO = {
      name: 'CLI_USER_INFO_SHOWED',
      category: 'APPLICATION',
      component: 'Cli',
      uuid: account.userId,
      metadata: {
        commandId: 'affinidi.showUser',
        ...generateUserMetadata(account.label),
      },
    }
    const userData = await userManagementService.me({ token })
    await analyticsService.eventsControllerSend(analyticsData)
    displayOutput({ itemToDisplay: JSON.stringify(userData, null, '  '), flag: flags.output })
  }

  protected async catch(error: CliError): Promise<void> {
    CliUx.ux.action.stop('failed')
    const outputFormat = configService.getOutputFormat()
    const optionsDisplay: DisplayOptions = {
      itemToDisplay: getErrorOutput(
        error,
        ShowUser.command,
        ShowUser.usage,
        ShowUser.description,
        outputFormat !== 'plaintext',
      ),
      err: true,
    }
    try {
      const { flags } = await this.parse(ShowUser)
      optionsDisplay.flag = flags.output
      displayOutput(optionsDisplay)
    } catch (_) {
      displayOutput(optionsDisplay)
    }
  }
}
