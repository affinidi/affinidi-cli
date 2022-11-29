import { Command, CliUx, Flags } from '@oclif/core'
import * as fs from 'fs/promises'
import { stringify as csv_stringify } from 'csv-stringify'
import { StatusCodes } from 'http-status-codes'

import { iAmService } from '../../services'
import { getSession } from '../../services/user-management'
import { getErrorOutput, CliError, Unauthorized } from '../../errors'
import { analyticsService, generateUserMetadata } from '../../services/analytics'
import { EventDTO } from '../../services/analytics/analytics.api'
import { isAuthenticated } from '../../middleware/authentication'

type ListProjectsOutputType = 'json' | 'table' | 'json-file' | 'csv-file'

export default class Projects extends Command {
  public static enableJsonFlag = true

  static command = 'affinidi list projects'

  static usage = 'show projects [FLAGS]'

  static description = 'Listing of all projects you created.'

  static examples = [
    '<%= config.bin %> <%= command.id %>',
    '<%= config.bin %> <%= command.id %> --skip=2 --limit=5 --output=csv-file',
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
    output: Flags.enum<ListProjectsOutputType>({
      char: 'o',
      description: 'Project listing output format',
      default: 'json',
      options: ['json', 'table', 'json-file', 'csv-file'],
    }),
  }

  public async run(): Promise<void> {
    const { flags } = await this.parse(Projects)
    if (!isAuthenticated()) {
      throw new CliError(Unauthorized, StatusCodes.UNAUTHORIZED, 'userManagement')
    }
    const session = getSession()

    const token = session?.accessToken
    const analyticsData: EventDTO = {
      name: 'CONSOLE_PROJECTS_READ',
      category: 'APPLICATION',
      component: 'Cli',
      uuid: session?.account?.id,
      metadata: {
        commandId: 'affinidi.listProjects',
        ...generateUserMetadata(session?.account?.label),
      },
    }

    CliUx.ux.action.start('Fetching list of projects')
    const projectData = await iAmService.listProjects(token, flags.skip, flags.limit)
    await analyticsService.eventsControllerSend(analyticsData)
    CliUx.ux.action.stop()

    switch (flags.output) {
      case 'table':
        CliUx.ux.table(
          projectData.map((data) => ({
            projectId: data.projectId,
            name: data.name,
            createdAt: data.createdAt,
          })),
          { projectId: {}, name: {}, createdAt: {} },
        )
        break
      case 'json-file':
        await fs.writeFile('projects.json', JSON.stringify(projectData, null, '  '))
        break
      case 'csv-file':
        await fs.writeFile('projects.csv', csv_stringify(projectData, { header: true }))
        break
      case 'json':
        CliUx.ux.info(JSON.stringify(projectData, null, '  '))
        break
      default:
        CliUx.ux.error('Unknown output format')
    }
  }

  async catch(error: CliError) {
    CliUx.ux.action.stop('failed')
    CliUx.ux.info(getErrorOutput(error, Projects.command, Projects.usage, Projects.description))
  }
}
