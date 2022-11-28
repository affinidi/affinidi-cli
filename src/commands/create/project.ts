import { Command, CliUx } from '@oclif/core'
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

export default class Project extends Command {
  static command = 'affinidi create project'

  static usage = 'affinidi create project [projectName]'

  static description = 'Use this command to create a new Affinidi project.'

  static examples = ['<%= config.bin %> <%= command.id %>']

  static args = [{ name: 'projectName' }]

  public async run(): Promise<void> {
    const { args } = await this.parse(Project)
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
      uuid: session?.account.id,
      metadata: {
        projectId: projectData?.projectId,
        commandId: 'affinidi.createProject',
        ...generateUserMetadata(session?.account.label),
      },
    }
    await analyticsService.eventsControllerSend(analyticsData)
    CliUx.ux.info(
      chalk.red.bold(
        'Please save the API key hash and DID URL somewhere safe. You would not be able to view them again.',
      ),
    )
    CliUx.ux.info(JSON.stringify(projectDetails, null, '  '))
  }

  async catch(error: CliError) {
    CliUx.ux.action.stop('failed')
    CliUx.ux.info(getErrorOutput(error, Project.command, Project.usage, Project.description))
  }
}
