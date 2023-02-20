import { Command, CliUx, Flags } from '@oclif/core'
import * as EmailValidator from 'email-validator'

import UseProject from '../use/project'
import { analyticsService, generateUserMetadata } from '../../services/analytics'
import { NextStepsRawMessage } from '../../render/functions'
import { configService, iAmService, userManagementService } from '../../services'
import { vaultService } from '../../services/vault/typedVaultService'
import { analyticsConsentPrompt, enterEmailPrompt, enterOTPPrompt } from '../../user-actions'
import { WrongEmailError, getErrorOutput, CliError } from '../../errors'
import { createOrUpdateConfig, createSession, parseJwt } from '../../services/user-management'
import { EventDTO } from '../../services/analytics/analytics.api'
import { DisplayOptions, displayOutput } from '../../middleware/display'
import { CHECK_OPERATION } from '../../hooks/check/checkVersion'
import { checkErrorFromWizard } from '../../wizard/helpers'
import { output } from '../../customFlags/outputFlag'

const MAX_EMAIL_ATTEMPT = 3

export default class Login extends Command {
  static command = 'affinidi login'

  static usage = 'login [email]'

  static description =
    'Use this command to log-in with your email address and use Affinidi privacy preserving services."'

  static examples = ['<%= config.bin %> <%= command.id %>']

  static args = [{ name: 'email' }]

  static flags = {
    output,
    isWizard: Flags.boolean({
      char: 'w',
      hidden: true,
      default: false,
    }),
  }

  public async run(): Promise<void> {
    const { failures } = await this.config.runHook('check', { id: CHECK_OPERATION.CONFIG })
    const { args, flags } = await this.parse(Login)
    let confVersionError: Error
    if (failures.length) {
      const failure = failures.shift()
      confVersionError = failure.error
    }

    let { email } = args
    if (!email && !configService.getUsername()) {
      displayOutput({
        itemToDisplay: `Now you can save your username using "affinidi config username" command, so you don't have to enter your username each time you log-in`,
        flag: flags.output,
      })
      email = await enterEmailPrompt()
    }
    if (!email) {
      try {
        email = configService.getUsername()
      } catch (_) {
        displayOutput({
          itemToDisplay: `Config file doesn't exist, after logging in there will be one created and you can then use the configured username feature`,
        })
      }
    }

    let wrongEmailCount = 0
    while (!EmailValidator.validate(email)) {
      email = await enterEmailPrompt()
      wrongEmailCount += 1
      if (wrongEmailCount === MAX_EMAIL_ATTEMPT) {
        throw new Error(WrongEmailError)
      }
    }

    // http request to affinidi sign-up endpoint
    CliUx.ux.action.start('Start logging in to Affinidi')
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
    const sessionWithoutPrefix = sessionToken.replace('console_authtoken=', '')
    vaultService.clear()
    createSession(email, userId, sessionWithoutPrefix)
    configService.setCurrentUserId(userId)
    if (confVersionError || !configService.userConfigMustBeValid(userId)) {
      const wantsToOptIn = await analyticsConsentPrompt()
      createOrUpdateConfig({ userId, analyticsOptIn: wantsToOptIn })
      await analyticsService.sendEnabledEvent(email, wantsToOptIn, 'affinidi.login')
    }
    vaultService.setTimeStamp()
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
    displayOutput({ itemToDisplay: 'You are authenticated', flag: flags.output })
    displayOutput({ itemToDisplay: `Welcome back to Affinidi ${email}!`, flag: flags.output })
    if (projectsList.length === 0 && !flags.isWizard) {
      displayOutput({ itemToDisplay: NextStepsRawMessage, flag: flags.output })
      return
    }

    if (projectsList.length === 1) {
      const projectId = projectsList.shift()?.projectId
      if (flags.output) {
        await UseProject.run([projectId, `--output=${flags.output}`])
        return
      }
      await UseProject.run([projectId])
      return
    }
    if (flags.output) {
      await UseProject.run([`--output=${flags.output}`])
      return
    }
    await UseProject.run([])
  }

  async catch(error: CliError) {
    if (checkErrorFromWizard(error)) throw error
    CliUx.ux.action.stop('failed')
    const outputFormat = configService.getOutputFormat()
    const optionsDisplay: DisplayOptions = {
      itemToDisplay: getErrorOutput(
        error,
        Login.command,
        Login.usage,
        Login.description,
        outputFormat !== 'plaintext',
      ),
      err: true,
    }
    try {
      const { flags } = await this.parse(Login)
      optionsDisplay.flag = flags.output
      displayOutput(optionsDisplay)
    } catch (_) {
      displayOutput(optionsDisplay)
    }
  }
}
