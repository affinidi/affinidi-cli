import { Command, CliUx, Flags } from '@oclif/core'
import { StatusCodes } from 'http-status-codes'
import chalk from 'chalk'

import { projectNamePrompt } from '../../user-actions'
import { iAmService, vaultService, VAULT_KEYS } from '../../services'
import { CreateProjectInput } from '../../services/iam/iam.api'
import { getSession } from '../../services/user-management'
import { getErrorOutput, CliError, Unauthorized } from '../../errors'
import { EventDTO } from '../../services/analytics/analytics.api'
import { analyticsService, generateUserMetadata } from '../../services/analytics'
import { isAuthenticated } from '../../middleware/authentication'
import { DisplayOptions, displayOutput } from '../../middleware/display'
import { configService } from '../../services/config'
import { ViewFormat } from '../../constants'

export default class Project extends Command {
  static command = 'affinidi create project'

  static usage = 'create project [projectName]'

  static description = 'Use this command to create a new Affinidi project.'

  static examples = ['<%= config.bin %> <%= command.id %>']

  static args = [{ name: 'projectName' }]

  static flags = {
    view: Flags.enum<ViewFormat>({
      char: 'v',
      description: 'set flag to override default output format view',
      options: ['plaintext', 'json'],
    }),
  }

  public async run(): Promise<void> {
    const { args, flags } = await this.parse(Project)
    if (!isAuthenticated()) {
      throw new CliError(Unauthorized, StatusCodes.UNAUTHORIZED, 'userManagement')
    }

    let { projectName } = args

    if (!projectName) {
      projectName = await projectNamePrompt()
    }
    const session = getSession()
    const token = session?.accessToken
    const projectNameInput: CreateProjectInput = {
      name: projectName,
    }
    CliUx.ux.action.start('Creating project')
    const projectData = await iAmService.createProject(token, projectNameInput)
    const projectDetails = await iAmService.getProjectSummary(token, projectData.projectId)
    CliUx.ux.action.stop('Project has been successfully created: ')
    vaultService.set(VAULT_KEYS.projectId, projectDetails.project.projectId)
    vaultService.set(VAULT_KEYS.projectName, projectDetails.project.name)
    vaultService.set(VAULT_KEYS.projectAPIKey, projectDetails.apiKey.apiKeyHash)
    vaultService.set(VAULT_KEYS.projectDID, projectDetails.wallet.did)
    const analyticsData: EventDTO = {
      name: 'CONSOLE_PROJECT_CREATED',
      category: 'APPLICATION',
      component: 'Cli',
      uuid: configService.getCurrentUser(),
      metadata: {
        projectId: projectData?.projectId,
        commandId: 'affinidi.createProject',
        ...generateUserMetadata(session?.account.label),
      },
    }
    await analyticsService.eventsControllerSend(analyticsData)
    displayOutput({
      itemToDisplay: chalk.red.bold(
        'Please save the API key hash and DID URL somewhere safe. You would not be able to view them again.',
      ),
      flag: flags.view,
    })
    displayOutput({ itemToDisplay: JSON.stringify(projectDetails, null, '  '), flag: flags.view })
  }

  async catch(error: CliError) {
    CliUx.ux.action.stop('failed')
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
      optionsDisplay.flag = flags.view
      displayOutput(optionsDisplay)
    } catch (error2) {
      displayOutput(optionsDisplay)
    }
  }
}
