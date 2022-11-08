import { Command, CliUx } from '@oclif/core'
import * as EmailValidator from 'email-validator'

import {
  acceptConditionsAndPolicy,
  enterEmailPrompt,
  enterOTPPrompt,
  AnswerYes,
} from '../../user-actions'
import { userManagementService } from '../../services'
import { WrongEmailError } from '../../errors'
import { buildWelcomeUserMessage } from '../../render/functions'
import { createSession, parseJwt } from '../../services/user-management'

const MAX_EMAIL_ATTEMPT = 3

export default class SignUp extends Command {
  static description = 'Use this command with your email address to create a new Affinid account.'

  static examples = ['<%= config.bin %> <%= command.id %>']

  static args = [{ name: 'email' }]

  public async run(): Promise<void> {
    const { args } = await this.parse(SignUp)

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

    const answer = await acceptConditionsAndPolicy()
    if (answer !== AnswerYes) {
      CliUx.ux.info("You must accept the conditions and policy to use Affinidi's services")
      return
    }

    // http request to affinidi sign-up endpoint
    CliUx.ux.action.start('Start signing-up to Affinidi')
    const token = await userManagementService.signUp(email)

    // mask input after enter is pressed
    CliUx.ux.action.start('Verifying the OTP')
    const confirmationCode = await enterOTPPrompt()

    CliUx.ux.action.start('Verifying the OTP')
    const sessionToken = await userManagementService.confirmAndGetToken(
      token,
      confirmationCode,
      'signup',
    )
    CliUx.ux.action.stop('OTP verified')
    CliUx.ux.action.stop('Sign-up successful')

    // Get userId from cookie. Slice removes `console_authtoken=` prefix.
    const { userId } = parseJwt(sessionToken.slice('console_authtoken='.length))

    createSession(email, userId, sessionToken)

    CliUx.ux.info(buildWelcomeUserMessage())
  }

  async catch(error: string | Error) {
    CliUx.ux.info(error.toString())
  }
}
