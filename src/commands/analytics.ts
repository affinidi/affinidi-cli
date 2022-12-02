import { CliUx, Command } from '@oclif/core'

import { analyticsConsentPrompt } from '../user-actions'
import { analyticsService } from '../services/analytics'

export const OPTIN_MESSAGE = 'You have opted in to analytics'
export const OPTOUT_MESSAGE = 'You have not opted in to analytics'

export default class Analytics extends Command {
  static description = 'Opt-in or opt-out of analytics'

  static examples = ['<%= config.bin %> <%= command.id %>']

  static args = [
    {
      name: 'newValue',
      required: false,
      description: 'Whether to send analytics to Affinidi',
      options: ['true', 'false'],
    },
  ]

  public async run(): Promise<void> {
    const { args } = await this.parse(Analytics)

    if (args.newValue != null) {
      const wantsToOptIn = args.newValue === 'true'
      analyticsService.setAnalyticsOptIn(wantsToOptIn)
      CliUx.ux.info(wantsToOptIn ? OPTIN_MESSAGE : OPTOUT_MESSAGE)
      return
    }

    if (analyticsService.hasOptedInOrOut()) {
      CliUx.ux.info(analyticsService.hasAnalyticsOptIn() ? OPTIN_MESSAGE : OPTOUT_MESSAGE)
      return
    }

    const wantsToOptIn = await analyticsConsentPrompt()
    analyticsService.setAnalyticsOptIn(wantsToOptIn)
    CliUx.ux.info(wantsToOptIn ? OPTIN_MESSAGE : OPTOUT_MESSAGE)
  }
}
