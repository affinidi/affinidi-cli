import select from '@inquirer/select'
import { ux, Flags } from '@oclif/core'
import { CLIError } from '@oclif/core/lib/errors'
import z from 'zod'
import { BaseCommand } from '../../common'
import { giveFlagInputErrorMessage } from '../../helpers/generate-error-message'
import { configService } from '../../services'
import { clientSDK } from '../../services/affinidi'
import { iamService } from '../../services/affinidi/iam'
import { ProjectDto } from '../../services/affinidi/iam/iam.api'

export class SelectProject extends BaseCommand<typeof SelectProject> {
  static summary = 'Sets a project as the active project'
  static examples = [
    '<%= config.bin %> <%= command.id %>',
    '<%= config.bin %> <%= command.id %> -i <project-id>',
    '<%= config.bin %> <%= command.id %> --project-id <project-id>',
  ]
  static flags = {
    'project-id': Flags.string({
      char: 'i',
      summary: 'ID of the project',
    }),
  }

  public async run(): Promise<ProjectDto> {
    const { flags } = await this.parse(SelectProject)
    const schema = z.string().uuid().optional()
    let projectId = schema.parse(flags['project-id'])

    ux.action.start('Fetching available projects')
    const userProjects: ProjectDto[] = await iamService.listProjects(clientSDK.config.getUserToken()?.access_token)
    ux.action.stop('Fetched successfully!')

    if (userProjects.length === 1) {
      const response = {
        id: userProjects[0].id,
        name: userProjects[0].name,
      }
      this.log('You have a single project:')
      if (!this.jsonEnabled()) this.logJson(response)
      return response
    }

    if (!projectId) {
      if (flags['no-input']) {
        throw new CLIError(giveFlagInputErrorMessage('project-id'))
      }

      const choices = userProjects.map((project) => ({
        value: project.id,
        name: `${project.name} [id: ${project.id}]`,
      }))
      projectId = await select({
        message: 'Select a project to set as active',
        choices,
      })
    }

    ux.action.start('Setting your active project')
    const signInResult = await clientSDK.login({
      projectId,
      userAccessToken: clientSDK.config.getUserToken()?.access_token || undefined,
      hideProjectHints: true,
    })
    ux.action.stop('Set successfully!')

    configService.createOrUpdate(signInResult.principalId)

    const response = {
      id: signInResult.activeProject.id,
      name: signInResult.activeProject.name,
    }
    if (!this.jsonEnabled()) this.logJson(response)
    return response
  }
}
