import { Command, CliUx } from '@oclif/core'
import * as EmailValidator from 'email-validator'

import { enterEmailPrompt, enterOTPPrompt } from '../../user-actions'
import { iAmService, userManagementService } from '../../services'
import { WrongEmailError, getErrorOutput, CliError } from '../../errors'
import { createSession, parseJwt } from '../../services/user-management'
import { NextStepsRawMessage } from '../../render/functions'
import UseProject from '../use/project'

const MAX_EMAIL_ATTEMPT = 3

export default class Login extends Command {
  static command = 'affinidi login'

  static usage = 'affinidi login [email]'

  static description =
    'Please log-in with your email address to use Affinidi privacy preserving services."'

  static examples = ['<%= config.bin %> <%= command.id %>']

  static args = [{ name: 'email' }]

  public async run(): Promise<void> {
    const { args } = await this.parse(Login)

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

    // http request to affinidi sign-up endpoint
    CliUx.ux.action.start('Start loging in to Affinidi')
    const token = await userManagementService.login(email)

    // mask input after enter is pressed
    const confirmationCode = await enterOTPPrompt()

    CliUx.ux.action.start('Verifying the OTP')
    const sessionToken = await userManagementService.confirmAndGetToken(
      token,
      confirmationCode,
      'login',
    )
    CliUx.ux.action.stop('OTP verified')
    CliUx.ux.action.stop('Log-in successful')

    // Get userId from cookie. Slice removes `console_authtoken=` prefix.
    const { userId } = parseJwt(sessionToken.slice('console_authtoken='.length))

    createSession(email, userId, sessionToken)

    const projectsList = await iAmService.listProjects(sessionToken, 0, Number.MAX_SAFE_INTEGER)
    CliUx.ux.info('You are authenticated')
    CliUx.ux.info(`Welcome back to Affinidi ${email}!`)
    if (projectsList.length === 0) {
      CliUx.ux.info(NextStepsRawMessage)
      return
    }

    if (projectsList.length === 1) {
      const projectId = projectsList.shift()?.projectId
      await UseProject.run([projectId])
      return
    }

    await UseProject.run([])
  }

  async catch(error: CliError) {
    CliUx.ux.action.stop('failed')
    CliUx.ux.info(getErrorOutput(error, Login.command, Login.usage, Login.description))
  }
}
