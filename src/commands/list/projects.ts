import { Command, ux, Flags } from '@oclif/core'
import { stringify as csv_stringify } from 'csv-stringify'
import { StatusCodes } from 'http-status-codes'

import { iAmService } from '../../services'
import { getSession } from '../../services/user-management'
import { getErrorOutput, CliError, Unauthorized } from '../../errors'
import { analyticsService, generateUserMetadata } from '../../services/analytics'
import { EventDTO } from '../../services/analytics/analytics.api'
import { isAuthenticated } from '../../middleware/authentication'
import { configService } from '../../services/config'
import { DisplayOptions, displayOutput } from '../../middleware/display'
import { checkErrorFromWizard } from '../../wizard/helpers'

export default class Projects extends Command {
  static command = 'affinidi list projects'

  static usage = 'show projects [FLAGS]'

  static description = 'Listing of all projects you created.'

  static examples = [
    '<%= config.bin %> <%= command.id %>',
    '<%= config.bin %> <%= command.id %> --skip=2 --limit=5 --output=json',
  ]

  static flags = {
    skip: Flags.integer({
      char: 's',
      description: 'Index into projects list from which to start the listing',
      default: 0,
    }),
    limit: Flags.integer({
      char: 'l',
      description: 'Maximum number of projects which will be listed',
      default: 10,
    }),
    output: Flags.string({
      char: 'o',
      description: 'Project listing output format',
      options: ['json', 'table', 'csv'],
    }),
  }

  public async run(): Promise<void> {
    const { flags } = await this.parse(Projects)
    const { skip, limit } = flags
    let { output } = flags
    if (!isAuthenticated()) {
      throw new CliError(Unauthorized, StatusCodes.UNAUTHORIZED, 'userManagement')
    }
    const { account, consoleAuthToken: token } = getSession()

    const analyticsData: EventDTO = {
      name: 'CONSOLE_PROJECTS_READ',
      category: 'APPLICATION',
      component: 'Cli',
      uuid: account.userId,
      metadata: {
        commandId: 'affinidi.listProjects',
        ...generateUserMetadata(account.label),
      },
    }

    ux.action.start('Fetching list of projects')
    const projectData = await iAmService.listProjects(token, skip, limit)
    await analyticsService.eventsControllerSend(analyticsData)
    ux.action.stop()
    const outputFormat = configService.getOutputFormat()
    if (!output && outputFormat === 'plaintext') {
      output = 'table'
    } else if (!flags.output) {
      output = 'json'
    }
    switch (output) {
      case 'table':
        ux.table(
          projectData.map((data) => ({
            projectId: data.projectId,
            name: data.name,
            createdAt: data.createdAt,
          })),
          { projectId: {}, name: {}, createdAt: {} },
        )
        break
      case 'csv':
        csv_stringify(projectData, { header: true }).pipe(process.stdout)
        break
      case 'json':
        ux.info(JSON.stringify(projectData, null, '  '))
        break
      default:
        throw new CliError('Unknown output format', 0, 'schema')
    }
  }

  async catch(error: CliError) {
    if (checkErrorFromWizard(error)) throw error
    ux.action.stop('failed')
    const outputFormat = configService.getOutputFormat()
    const optionsDisplay: DisplayOptions = {
      itemToDisplay: getErrorOutput(
        error,
        Projects.command,
        Projects.usage,
        Projects.description,
        outputFormat !== 'plaintext',
      ),
      err: true,
    }
    try {
      const { flags } = await this.parse(Projects)
      if (flags.output === 'table') {
        optionsDisplay.flag = 'plaintext'
      } else if (flags.output === 'json') {
        optionsDisplay.flag = 'json'
      }
      displayOutput(optionsDisplay)
    } catch (_) {
      displayOutput(optionsDisplay)
    }
  }
}
