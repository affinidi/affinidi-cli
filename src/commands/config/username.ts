import { CliUx, Command, Flags } from '@oclif/core'
import * as EmailValidator from 'email-validator'
import { StatusCodes } from 'http-status-codes'

import { enterEmailPrompt } from '../../user-actions'
import { ViewFormat } from '../../constants'
import { CliError, getErrorOutput, Unauthorized, WrongEmailError } from '../../errors'
import { configService } from '../../services/config'
import { DisplayOptions, displayOutput } from '../../middleware/display'
import { isAuthenticated } from '../../middleware/authentication'
import { EventDTO } from '../../services/analytics/analytics.api'
import { getSession } from '../../services/user-management'
import { analyticsService, generateUserMetadata } from '../../services/analytics'

const MAX_EMAIL_ATTEMPT = 3

export default class Username extends Command {
  static description =
    'Use this command to set a username. This username will be used when logging in the future if not one provided'

  static examples = ['<%= config.bin %> <%= command.id %> example@email.com']

  static command = 'affinidi config username'

  static usage = 'config username [email]'

  static flags = {
    unset: Flags.boolean({
      char: 'u',
      description: 'remove username from config',
      default: false,
    }),
    output: Flags.enum<ViewFormat>({
      char: 'o',
      description: 'set flag to override default output format view',
      options: ['json', 'plaintext'],
    }),
  }

  static args = [{ name: 'email' }]

  public async run(): Promise<void> {
    const { args, flags } = await this.parse(Username)
    if (!isAuthenticated()) {
      throw new CliError(Unauthorized, StatusCodes.UNAUTHORIZED, 'config')
    }
    const { account } = getSession()
    const analyticsData: EventDTO = {
      category: 'APPLICATION',
      component: 'Cli',
      uuid: account.userId,
      metadata: {
        commandId: 'affinidi.configUsername',
        ...generateUserMetadata(account.label),
      },
      name: 'CLI_CONFIG_USERNAME_SET',
    }

    if (flags.unset) {
      analyticsData.name = 'CLI_CONFIG_USERNAME_UNSET'
      configService.setUsername('')
      displayOutput({ itemToDisplay: 'Your username is unset', flag: flags.output })
      await analyticsService.eventsControllerSend(analyticsData)
      return
    }
    let { email } = args
    if (!email) {
      email = await enterEmailPrompt()
    }

    let wrongEmailCount = 0
    while (!EmailValidator.validate(email)) {
      email = await enterEmailPrompt()
      wrongEmailCount += 1
      if (wrongEmailCount === MAX_EMAIL_ATTEMPT) {
        CliUx.ux.error(WrongEmailError)
      }
    }
    configService.setUsername(email)
    displayOutput({ itemToDisplay: 'Your username is set', flag: flags.output })
    await analyticsService.eventsControllerSend(analyticsData)
  }

  async catch(error: CliError) {
    CliUx.ux.action.stop('failed')
    const outputFormat = configService.getOutputFormat()
    const optionsDisplay: DisplayOptions = {
      itemToDisplay: getErrorOutput(
        error,
        Username.command,
        Username.usage,
        Username.description,
        outputFormat !== 'plaintext',
      ),
      err: true,
    }
    try {
      const { flags } = await this.parse(Username)
      optionsDisplay.flag = flags.output
      displayOutput(optionsDisplay)
    } catch (_) {
      displayOutput(optionsDisplay)
    }
  }
}
