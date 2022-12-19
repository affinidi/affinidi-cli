import { CliUx, Command, Flags } from '@oclif/core'

import { analyticsConsentPrompt } from '../user-actions'
import { analyticsService, configService } from '../services'
import { ViewFormat } from '../constants'
import { DisplayOptions, displayOutput } from '../middleware/display'
import { CliError, getErrorOutput } from '../errors'

export const OPTIN_MESSAGE = 'You have opted in to analytics'
export const OPTOUT_MESSAGE = 'You have not opted in to analytics'

export default class Analytics extends Command {
  static description = 'Use this command to opt-in or opt-out of analytics'

  static command = 'affinidi analytics'

  static usage = 'analytics [ true | false ]'

  static examples = ['<%= config.bin %> <%= command.id %>']

  static args = [
    {
      name: 'newValue',
      required: false,
      description: 'Whether to send analytics to Affinidi',
      options: ['true', 'false'],
    },
  ]

  static flags = {
    output: Flags.enum<ViewFormat>({
      char: 'o',
      description: 'set flag to override default output format view',
      options: ['plaintext', 'json'],
    }),
  }

  public async run(): Promise<void> {
    const { args, flags } = await this.parse(Analytics)
    if (args.newValue != null) {
      const wantsToOptIn = args.newValue === 'true'
      analyticsService.setAnalyticsOptIn(wantsToOptIn)
      displayOutput({
        itemToDisplay: wantsToOptIn ? OPTIN_MESSAGE : OPTOUT_MESSAGE,
        flag: flags.output,
      })
      return
    }

    if (analyticsService.hasOptedInOrOut()) {
      displayOutput({
        itemToDisplay: analyticsService.hasAnalyticsOptIn() ? OPTIN_MESSAGE : OPTOUT_MESSAGE,
        flag: flags.output,
      })
      return
    }

    const wantsToOptIn = await analyticsConsentPrompt()
    analyticsService.setAnalyticsOptIn(wantsToOptIn)
    displayOutput({
      itemToDisplay: wantsToOptIn ? OPTIN_MESSAGE : OPTOUT_MESSAGE,
      flag: flags.output,
    })
  }

  async catch(error: CliError) {
    CliUx.ux.action.stop('failed')
    const outputFormat = configService.getOutputFormat()
    const optionsDisplay: DisplayOptions = {
      itemToDisplay: getErrorOutput(
        error,
        Analytics.command,
        Analytics.usage,
        Analytics.description,
        outputFormat !== 'plaintext',
      ),
      err: true,
    }
    try {
      const { flags } = await this.parse(Analytics)
      optionsDisplay.flag = flags.output
      displayOutput(optionsDisplay)
    } catch (_) {
      displayOutput(optionsDisplay)
    }
  }
}
