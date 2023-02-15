import { ux, Command, Args } from '@oclif/core'
import { StatusCodes } from 'http-status-codes'

import { vaultService } from '../../services/vault/typedVaultService'
import { configService, iAmService } from '../../services'
import { getSession } from '../../services/user-management'
import { getErrorOutput, CliError, Unauthorized } from '../../errors'
import { selectProject } from '../../user-actions'
import { NextStepsRawMessage } from '../../render/functions'
import { EventDTO } from '../../services/analytics/analytics.api'
import { analyticsService, generateUserMetadata } from '../../services/analytics'
import { isAuthenticated } from '../../middleware/authentication'
import { DisplayOptions, displayOutput } from '../../middleware/display'
import { checkErrorFromWizard } from '../../wizard/helpers'
import { output } from '../../customFlags/outputFlag'

export default class Project extends Command {
  static command = 'affinidi use'

  static description =
    'Lets you choose and activate a project. An active project is a prerequisite for executing most commands.'

  static usage = 'use project [project-id] [FLAGS]'

  static examples = ['<%= config.bin %> <%= command.id %> example-id']

  static flags = {
    output,
  }

  static args = {
    'project-id': Args.string({
      name: 'project-id',
      description: 'the ID of the project to use',
    }),
  }

  public async run(): Promise<void> {
    const { args, flags } = await this.parse(Project)
    if (!isAuthenticated()) {
      throw new CliError(`${Unauthorized}`, StatusCodes.UNAUTHORIZED, 'userManagement')
    }

    let projectId = args['project-id']
    const { account, consoleAuthToken: token } = getSession()

    if (!projectId) {
      ux.action.start('Fetching projects')
      const projectData = await iAmService.listProjects(token, 0, Number.MAX_SAFE_INTEGER)
      if (projectData.length === 0) {
        ux.action.stop('No Projects were found')
        displayOutput({ itemToDisplay: NextStepsRawMessage, flag: flags.output })
        return
      }
      ux.action.stop('List of projects: ')
      const maxNameLength = projectData
        .map((p) => p.name.length)
        .reduce((p, c) => Math.max(p, c), 0)

      projectId = await selectProject(projectData, maxNameLength)
    }
    const projectToBeActive = await iAmService.getProjectSummary(token, projectId)
    const { userId, label } = account
    vaultService.setActiveProject(projectToBeActive)
    const analyticsData: EventDTO = {
      name: 'CONSOLE_PROJECT_SET_ACTIVE',
      category: 'APPLICATION',
      component: 'Cli',
      uuid: userId,
      metadata: {
        commandId: 'affinidi.useProject',
        projectId: projectToBeActive.project.projectId,
        ...generateUserMetadata(label),
      },
    }

    configService.setCurrentProjectId(projectToBeActive?.project?.projectId)
    await analyticsService.eventsControllerSend(analyticsData)
    const test = process.env.NODE_ENV === 'test'
    if (projectToBeActive.apiKey?.apiKeyHash && !test) {
      projectToBeActive.apiKey.apiKeyHash = ''.padEnd(
        projectToBeActive.apiKey.apiKeyHash?.length,
        '*',
      )
    }
    if (projectToBeActive.wallet?.didUrl && !test) {
      projectToBeActive.wallet.didUrl = ''.padEnd(projectToBeActive.wallet.didUrl?.length, '*')
    }

    displayOutput({
      itemToDisplay: JSON.stringify(projectToBeActive, null, '  '),
      flag: flags.output,
    })
  }

  async catch(error: CliError) {
    if (checkErrorFromWizard(error)) throw error
    ux.action.stop('failed')
    const outputFormat = configService.getOutputFormat()
    const optionsDisplay: DisplayOptions = {
      itemToDisplay: getErrorOutput(
        error,
        Project.command,
        Project.usage,
        Project.description,
        outputFormat !== 'plaintext',
      ),
      err: true,
    }
    try {
      const { flags } = await this.parse(Project)
      optionsDisplay.flag = flags.output
      displayOutput(optionsDisplay)
    } catch (_) {
      displayOutput(optionsDisplay)
    }
  }
}
