import { ProjectDto } from '@affinidi-tdk/iam-client'
import { select } from '@inquirer/prompts'
import { ux, Flags } from '@oclif/core'
import { CLIError } from '@oclif/core/errors'
import z from 'zod'
import { BaseCommand } from '../../common/base-command.js'
import { giveFlagInputErrorMessage } from '../../common/error-messages.js'
import { INPUT_LIMIT } from '../../common/validators.js'
import { bffService } from '../../services/affinidi/bff-service.js'

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
    const schema = z.string().max(INPUT_LIMIT).uuid().optional()
    let projectId = schema.parse(flags['project-id'])

    ux.action.start('Fetching available projects')
    const userProjects = await bffService.getProjects()
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

    const selectedProject = userProjects.find((project) => project.id === projectId)
    if (!selectedProject) {
      throw new CLIError('Project not found')
    }

    ux.action.start('Setting your active project')
    await bffService.setSessionActiveProject(selectedProject.id)
    ux.action.stop('Set successfully!')

    if (!this.jsonEnabled()) this.logJson(selectedProject)
    return selectedProject
  }
}
