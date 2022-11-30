import { Command, CliUx, Flags } from '@oclif/core'
import * as fs from 'fs/promises'
import { stringify as csv_stringify } from 'csv-stringify'
import { StatusCodes } from 'http-status-codes'

import { iAmService, vaultService, VAULT_KEYS } from '../../services'
import { getSession } from '../../services/user-management'
import { getErrorOutput, CliError, Unauthorized } from '../../errors'
import { analyticsService, generateUserMetadata } from '../../services/analytics'
import { EventDTO } from '../../services/analytics/analytics.api'
import { isAuthenticated } from '../../middleware/authentication'
import { configService } from '../../services/config'

type ListProjectsOutputType = 'json' | 'table' | 'json-file' | 'csv-file'

export default class Projects extends Command {
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
      options: ['json', 'table', 'json-file', 'csv-file'],
    }),
  }

  public async run(): Promise<void> {
    const { flags } = await this.parse(Projects)
    let { skip, limit, output } = flags
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
    const projectData = await iAmService.listProjects(token, skip, limit)
    await analyticsService.eventsControllerSend(analyticsData)
    CliUx.ux.action.stop()
    const outputFormat = configService.get('configs')[session?.account?.id]?.outputFormat
    if (!output && outputFormat === 'plaintext') {
      output = 'table'
    } else if (!output) {
      output = 'json'
    }
    switch (output) {
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
        throw new CliError('Unknown output format', 0, 'schema')
    }
  }

  async catch(error: CliError) {
    CliUx.ux.action.stop('failed')
    const userId = JSON.parse(vaultService.get(VAULT_KEYS.session))?.account?.id
    const outputFormat = configService.getOutputFormat(userId)
    CliUx.ux.info(
      getErrorOutput(
        error,
        Projects.command,
        Projects.usage,
        Projects.description,
        outputFormat !== 'plaintext',
      ),
    )
  }
}
