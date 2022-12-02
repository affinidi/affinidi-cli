import { Command, CliUx, Flags } from '@oclif/core'
import * as EmailValidator from 'email-validator'

import UseProject from '../use/project'
import { analyticsService, generateUserMetadata } from '../../services/analytics'
import { NextStepsRawMessage } from '../../render/functions'
import { iAmService, userManagementService } from '../../services'
import { enterEmailPrompt, enterOTPPrompt } from '../../user-actions'
import { WrongEmailError, getErrorOutput, CliError } from '../../errors'
import { createSession, parseJwt } from '../../services/user-management'
import { EventDTO } from '../../services/analytics/analytics.api'
import { displayOutput } from '../../middleware/display'
import { ViewFormat } from '../../constants'

const MAX_EMAIL_ATTEMPT = 3

export default class Login extends Command {
  static command = 'affinidi login'

  static usage = 'login [email]'

  static description =
    'Please log-in with your email address to use Affinidi privacy preserving services."'

  static examples = ['<%= config.bin %> <%= command.id %>']

  static args = [{ name: 'email' }]

  static flags = {
    view: Flags.enum<ViewFormat>({
      char: 'v',
      description: 'set flag to override default output format view',
      options: ['plaintext', 'json'],
    }),
  }

  public async run(): Promise<void> {
    const { args, flags } = await this.parse(Login)

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
    const analyticsData: EventDTO = {
      name: 'CONSOLE_USER_SIGN_IN',
      category: 'APPLICATION',
      component: 'Cli',
      uuid: userId,
      metadata: {
        commandId: 'affinidi.login',
        ...generateUserMetadata(email),
      },
    }
    await analyticsService.eventsControllerSend(analyticsData)

    const projectsList = await iAmService.listProjects(sessionToken, 0, Number.MAX_SAFE_INTEGER)
    displayOutput('You are authenticated', flags.view)
    displayOutput(`Welcome back to Affinidi ${email}!`, flags.view)
    if (projectsList.length === 0) {
      displayOutput(NextStepsRawMessage, flags.view)
      return
    }

    if (projectsList.length === 1) {
      const projectId = projectsList.shift()?.projectId
      if (flags.view) {
        await UseProject.run([projectId, `--view=${flags.view}`])
        return
      }
      await UseProject.run([projectId])
      return
    }

    await UseProject.run([flags.view ? `--view=${flags.view}` : ''])
  }

  async catch(error: CliError) {
    CliUx.ux.action.stop('failed')
    CliUx.ux.info(getErrorOutput(error, Login.command, Login.usage, Login.description, false))
  }
}
