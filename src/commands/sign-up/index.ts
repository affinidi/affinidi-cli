import { Command, ux, Args } from '@oclif/core'
import * as EmailValidator from 'email-validator'

import {
  acceptConditionsAndPolicy,
  enterEmailPrompt,
  enterOTPPrompt,
  AnswerYes,
  analyticsConsentPrompt,
} from '../../user-actions'
import { userManagementService } from '../../services'
import { vaultService } from '../../services/vault/typedVaultService'
import { CliError, WrongEmailError, getErrorOutput } from '../../errors'
import { WelcomeUserStyledMessage } from '../../render/functions'
import { createOrUpdateConfig, createSession, parseJwt } from '../../services/user-management'
import { EventDTO } from '../../services/analytics/analytics.api'
import { analyticsService, generateUserMetadata } from '../../services/analytics'
import CreateProject from '../create/project'
import { checkErrorFromWizard } from '../../wizard/helpers'

const MAX_EMAIL_ATTEMPT = 3

export default class SignUp extends Command {
  static command = 'affinidi sign-up'

  static description = 'Use this command with your email address to create a new Affinidi account.'

  static examples = ['<%= config.bin %> <%= command.id %> example@email.com']

  static args = { email: Args.string() }

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
        ux.error(WrongEmailError)
      }
    }

    const answer = await acceptConditionsAndPolicy()
    if (answer !== AnswerYes) {
      ux.info("You must accept the conditions and policy to use Affinidi's services")
      return
    }

    const wantsToOptIn = await analyticsConsentPrompt()

    // http request to affinidi sign-up endpoint
    ux.action.start('Start signing-up to Affinidi')
    const token = await userManagementService.signUp(email)

    // mask input after enter is pressed
    ux.action.start('Verifying the OTP')
    const confirmationCode = await enterOTPPrompt()

    ux.action.start('Verifying the OTP')
    const sessionToken = await userManagementService.confirmAndGetToken(
      token,
      confirmationCode,
      'signup',
    )
    ux.action.stop('OTP verified')
    ux.action.stop('Sign-up successful')

    // Get userId from cookie. Slice removes `console_authtoken=` prefix.
    const { userId } = parseJwt(sessionToken.slice('console_authtoken='.length))
    const sessionWithoutPrefix = sessionToken.replace('console_authtoken=', '')
    vaultService.clear()
    createSession(email, userId, sessionWithoutPrefix)
    createOrUpdateConfig({ userId, analyticsOptIn: wantsToOptIn })
    vaultService.setTimeStamp()
    await analyticsService.sendEnabledEvent(email, wantsToOptIn, 'affinidi.sign-up')

    const analyticsData: EventDTO = {
      name: 'CONSOLE_USER_SIGN_UP',
      category: 'APPLICATION',
      component: 'Cli',
      uuid: userId,
      metadata: {
        commandId: 'affinidi.sign-up',
        ...generateUserMetadata(email),
      },
    }
    await analyticsService.eventsControllerSend(analyticsData)
    ux.info(`${WelcomeUserStyledMessage}\n`)

    await CreateProject.run(['Default Project'])
  }

  async catch(error: CliError) {
    if (checkErrorFromWizard(error)) throw error
    ux.action.stop('failed')
    ux.info(getErrorOutput(error, SignUp.command, SignUp.command, SignUp.description, false))
  }
}
