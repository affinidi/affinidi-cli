import { Command, CliUx } from '@oclif/core'

import { projectNamePrompt } from '../../user-actions'
import { SESSION_TOKEN_KEY_NAME, iAmService, vaultService } from '../../services'
import { CreateProjectInput } from '../../services/iam/iam.api'

const ACTIVE_PROJECT = 'activeProject'

export default class Project extends Command {
  static description = 'Use this command to create a new Affinidi project'

  static examples = ['<%= config.bin %> <%= command.id %>']

  static args = [{ name: 'projectName' }]

  public async run(): Promise<void> {
    const { args } = await this.parse(Project)

    let { projectName } = args

    if (!projectName) {
      projectName = await projectNamePrompt()
    }
    const token = vaultService.get(SESSION_TOKEN_KEY_NAME)
    const projectNameInput: CreateProjectInput = {
      name: projectName,
    }
    CliUx.ux.action.start('Creating project...')
    const projectData = await iAmService.createProject({ token }, projectNameInput)
    const projectDetails = await iAmService.getProjectSummary({ token }, projectData.projectId)
    CliUx.ux.action.stop('Project has been successfully created: ')
    vaultService.set(ACTIVE_PROJECT, {
      projectId: projectDetails.project.projectId,
      apiKeyHash: projectDetails.apiKey.apiKeyHash,
      did: projectDetails.wallet.did,
      projectName: projectDetails.project.name,
    })
    CliUx.ux.info(JSON.stringify(projectDetails, null, '  '))
  }

  async catch(error: string | Error) {
    CliUx.ux.info(error.toString())
  }
}
