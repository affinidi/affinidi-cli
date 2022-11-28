import { CliUx, Command, Flags, Interfaces } from '@oclif/core'
import * as fs from 'fs/promises'
import { StatusCodes } from 'http-status-codes'

import { getSession } from '../../services/user-management'
import { getErrorOutput, CliError, Unauthorized } from '../../errors'
import { iAmService, vaultService, VAULT_KEYS } from '../../services'
import { selectProject } from '../../user-actions'
import { NextStepsRawMessage } from '../../render/functions'
import { EventDTO } from '../../services/analytics/analytics.api'
import { analyticsService, generateUserMetadata } from '../../services/analytics'
import { isAuthenticated } from '../../middleware/authentication'

type UseFieldType = 'json' | 'json-file'

export default class ShowProject extends Command {
  static command = 'affinidi show project'

  static usage = 'show project [project-id]'

  static description = `Fetches the information of a specific project.`

  static examples = ['<%= config.bin %> <%= command.id %>']

  static flags = {
    output: Flags.enum<UseFieldType>({
      char: 'o',
      options: ['json', 'json-file'],
      description: 'The details of the schema to show',
      default: 'json',
    }),
    active: Flags.boolean({
      char: 'a',
    }),
  }

  static args: Interfaces.Arg[] = [
    {
      name: 'project-id',
      description: 'id of the project to use',
    },
  ]

  public async run(): Promise<void> {
    const { args, flags } = await this.parse(ShowProject)
    if (!isAuthenticated()) {
      throw new CliError(Unauthorized, StatusCodes.UNAUTHORIZED, 'userManagement')
    }

    const session = getSession()
    const token = session?.accessToken
    let projectId = args['project-id']

    if (flags.active) {
      projectId = vaultService.get(VAULT_KEYS.projectId)
      CliUx.ux.action.start('Fetching active project')
    } else if (projectId) {
      CliUx.ux.action.start(`Fetching project with id: ${projectId}`)
    } else {
      CliUx.ux.action.start('Fetching projects')
      const projectData = await iAmService.listProjects(token, 0, Number.MAX_SAFE_INTEGER)
      if (projectData.length === 0) {
        CliUx.ux.action.stop('No Projects were found')
        CliUx.ux.info(NextStepsRawMessage)
        return
      }
      CliUx.ux.action.stop('List of projects: ')
      const maxNameLength = projectData
        .map((p) => p.name.length)
        .reduce((p, c) => Math.max(p, c), 0)

      projectId = await selectProject(projectData, maxNameLength)
      CliUx.ux.action.start(`Fetching project with id: ${projectId}`)
    }

    const projectData = await iAmService.getProjectSummary(token, projectId)
    const analyticsData: EventDTO = {
      name: 'CONSOLE_PROJECT_READ',
      category: 'APPLICATION',
      component: 'Cli',
      uuid: session?.account?.id,
      metadata: {
        projectId: projectData?.project?.projectId,
        commandId: 'affinidi.showProject',
        ...generateUserMetadata(session?.account?.label),
      },
    }
    await analyticsService.eventsControllerSend(analyticsData)
    if (projectData.apiKey?.apiKeyHash) {
      projectData.apiKey.apiKeyHash = ''.padEnd(projectData.apiKey.apiKeyHash?.length, '*')
    }
    if (projectData.wallet?.didUrl) {
      projectData.wallet.didUrl = ''.padEnd(projectData.wallet.didUrl?.length, '*')
    }
    if (flags.output === 'json-file') {
      await fs.writeFile('projects.json', JSON.stringify(projectData, null, '  '))
    } else {
      CliUx.ux.info(JSON.stringify(projectData, null, '  '))
    }
    CliUx.ux.action.stop('')
  }

  async catch(error: CliError) {
    CliUx.ux.action.stop('failed')
    CliUx.ux.info(
      getErrorOutput(error, ShowProject.command, ShowProject.usage, ShowProject.description),
    )
  }
}
