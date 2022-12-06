import { CliUx, Command, Flags } from '@oclif/core'
import * as EmailValidator from 'email-validator'

import { enterEmailPrompt } from '../../user-actions'
import { ViewFormat } from '../../constants'
import { WrongEmailError } from '../../errors'
import { configService } from '../../services/config'
import { displayOutput } from '../../middleware/display'

const MAX_EMAIL_ATTEMPT = 3

export default class Username extends Command {
  static description =
    'is used to save a username to be used when not specifying a username when loggin in'

  static examples = ['<%= config.bin %> <%= command.id %> example@email.com']

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

    // if (flags.unset) {

    // }
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
    displayOutput({ itemToDisplay: 'Your username is now saved', flag: flags.output })
  }
}
