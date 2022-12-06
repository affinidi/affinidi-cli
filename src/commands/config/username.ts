import { CliUx, Command, Flags } from '@oclif/core'
import * as EmailValidator from 'email-validator'
import { StatusCodes } from 'http-status-codes'

import { enterEmailPrompt } from '../../user-actions'
import { ViewFormat } from '../../constants'
import { CliError, getErrorOutput, Unauthorized, WrongEmailError } from '../../errors'
import { configService } from '../../services/config'
import { DisplayOptions, displayOutput } from '../../middleware/display'
import { isAuthenticated } from '../../middleware/authentication'

const MAX_EMAIL_ATTEMPT = 3

export default class Username extends Command {
  static description =
    'is used to save a username to be used when not specifying a username when loggin in'

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

    if (flags.unset) {
      configService.setUsername('')
      displayOutput({ itemToDisplay: 'Your username is unset', flag: flags.output })
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
