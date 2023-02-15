import { ux, Command, Args } from '@oclif/core'
import { StatusCodes } from 'http-status-codes'

import { configService } from '../../services'
import { CliError, getErrorOutput, Unauthorized } from '../../errors'
import { isAuthenticated } from '../../middleware/authentication'
import { displayOutput } from '../../middleware/display'
import { EventDTO } from '../../services/analytics/analytics.api'
import { analyticsService, generateUserMetadata } from '../../services/analytics'
import { getSession } from '../../services/user-management'

export default class View extends Command {
  static command = 'affinidi config view'

  static description = 'Use this command to configure the format of output'

  static examples = [
    '<%= config.bin %> <%= command.id %> json',
    '<%= config.bin %> <%= command.id %> plaintext',
  ]

  static usage = 'config view [plaintext | json]'

  static args = {
    format: Args.string({
      required: true,
      options: ['plaintext', 'json'],
      description: 'format of the output',
    }),
  }

  public async run(): Promise<void> {
    const { args } = await this.parse(View)
    const { format } = args
    if (!isAuthenticated()) {
      throw new CliError(Unauthorized, StatusCodes.UNAUTHORIZED, 'config')
    }
    const { account } = getSession()

    configService.setOutputFormat(format)
    displayOutput({ itemToDisplay: `Default output format view is set to ${format}` })
    const analyticsData: EventDTO = {
      name: 'CLI_VIEW_FORMAT_CONFIGURED',
      category: 'APPLICATION',
      component: 'Cli',
      uuid: account.userId,
      metadata: {
        format,
        commandId: 'affinidi.configView',
        ...generateUserMetadata(account.label),
      },
    }
    await analyticsService.eventsControllerSend(analyticsData)
  }

  async catch(error: CliError) {
    ux.action.stop('failed')
    const outputFormat = configService.getOutputFormat()

    displayOutput({
      itemToDisplay: getErrorOutput(
        error,
        View.command,
        View.usage,
        View.description,
        outputFormat !== 'plaintext',
      ),
      err: true,
    })
  }
}
