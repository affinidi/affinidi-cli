import { CliUx, Command, Flags, Interfaces } from '@oclif/core'

import { StatusCodes } from 'http-status-codes'

import { getSession } from '../../services/user-management'
import { getErrorOutput, CliError, Unauthorized } from '../../errors'
import { vaultService } from '../../services/vault/typedVaultService'
import { iAmService } from '../../services'
import { selectProject } from '../../user-actions'
import { NextStepsRawMessage } from '../../render/functions'
import { EventDTO } from '../../services/analytics/analytics.api'
import { analyticsService, generateUserMetadata } from '../../services/analytics'
import { isAuthenticated } from '../../middleware/authentication'
import { DisplayOptions, displayOutput } from '../../middleware/display'
import { configService } from '../../services/config'
import { ViewFormat } from '../../constants'

export default class ShowProject extends Command {
  static command = 'affinidi show project'

  static usage = 'show project [project-id]'

  static description = `Fetches the information of a specific project.`

  static examples = ['<%= config.bin %> <%= command.id %>']

  static flags = {
    active: Flags.boolean({
      char: 'a',
    }),
    output: Flags.enum<ViewFormat>({
      char: 'o',
      description: 'set flag to override default output format view',
      options: ['plaintext', 'json'],
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

    const { account, consoleAuthToken: token } = getSession()
    let projectId = args['project-id']

    if (flags.active) {
      CliUx.ux.action.start('Fetching active project')

      let activeProject
      try {
        activeProject = vaultService.getActiveProject()
      } catch (err) {
        if (err instanceof CliError) {
          CliUx.ux.action.stop('No active project')
          displayOutput({ itemToDisplay: NextStepsRawMessage, flag: flags.output })
          return
        } else {
          throw err
        }
      }

      projectId = activeProject.project.projectId
    } else if (projectId) {
      CliUx.ux.action.start(`Fetching project with id: ${projectId}`)
    } else {
      CliUx.ux.action.start('Fetching projects')
      const projectData = await iAmService.listProjects(token, 0, Number.MAX_SAFE_INTEGER)
      if (projectData.length === 0) {
        CliUx.ux.action.stop('No Projects were found')
        displayOutput({ itemToDisplay: NextStepsRawMessage, flag: flags.output })
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
      uuid: configService.getCurrentUser(),
      metadata: {
        projectId: projectData.project.projectId,
        commandId: 'affinidi.showProject',
        ...generateUserMetadata(account.label),
      },
    }
    await analyticsService.eventsControllerSend(analyticsData)
    if (projectData.apiKey?.apiKeyHash) {
      projectData.apiKey.apiKeyHash = ''.padEnd(projectData.apiKey.apiKeyHash?.length, '*')
    }
    if (projectData.wallet?.didUrl) {
      projectData.wallet.didUrl = ''.padEnd(projectData.wallet.didUrl?.length, '*')
    }

    displayOutput({ itemToDisplay: JSON.stringify(projectData, null, '  '), flag: flags.output })

    CliUx.ux.action.stop('')
  }

  async catch(error: CliError) {
    CliUx.ux.action.stop('failed')
    const outputFormat = configService.getOutputFormat()
    const optionsDisplay: DisplayOptions = {
      itemToDisplay: getErrorOutput(
        error,
        ShowProject.command,
        ShowProject.usage,
        ShowProject.description,
        outputFormat !== 'plaintext',
      ),
      err: true,
    }
    try {
      const { flags } = await this.parse(ShowProject)
      optionsDisplay.flag = flags.output
      displayOutput(optionsDisplay)
    } catch (_) {
      displayOutput(optionsDisplay)
    }
  }
}
