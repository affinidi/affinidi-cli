import { CliUx, Command, Flags } from '@oclif/core'

import { analyticsConsentPrompt } from '../user-actions'
import { analyticsService } from '../services'
import { ViewFormat } from '../constants'
import { displayOutput } from '../middleware/display'

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
}
