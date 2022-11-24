import { CliUx, Command } from '@oclif/core'
import { analyticsService } from '../services/analytics'

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
      analyticsService.setAnalyticsOptIn(args.newValue)
    }

    if (await analyticsService.hasAnalyticsOptIn()) {
      CliUx.ux.info('You have opted in to analytics')
    } else {
      CliUx.ux.info('You have not opted in to analytics')
    }
  }
}
