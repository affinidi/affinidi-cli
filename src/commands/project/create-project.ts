import { ux, Flags } from '@oclif/core'
import z from 'zod'
import { BaseCommand } from '../../common/base-command.js'
import { promptRequiredParameters } from '../../common/prompts.js'
import { INPUT_LIMIT } from '../../common/validators.js'
import { bffService } from '../../services/affinidi/bff-service.js'
import { ProjectDto } from '../../services/affinidi/iam/iam.api.js'

export class CreateProject extends BaseCommand<typeof CreateProject> {
  static summary = 'Creates a project and sets it as the active project'
  static examples = [
    '<%= config.bin %> <%= command.id %> -n MyProjectName',
    '<%= config.bin %> <%= command.id %> --name "My project name"',
  ]
  static flags = {
    name: Flags.string({
      char: 'n',
      summary: 'Name of the project',
    }),
    description: Flags.string({
      char: 'd',
      summary: 'Description of the project',
    }),
  }

  public async run(): Promise<ProjectDto> {
    const { flags } = await this.parse(CreateProject)
    const promptFlags = await promptRequiredParameters(['name'], flags)
    const schema = z.object({
      name: z.string().max(INPUT_LIMIT),
      description: z.string().max(INPUT_LIMIT).optional(),
    })
    const validatedFlags = schema.parse(promptFlags)

    ux.action.start('Creating the project')

    const createProjectOutput = await bffService.createProject({
      name: validatedFlags.name,
      description: validatedFlags.description,
    })

    ux.action.stop('Created successfully!')

    if (!this.jsonEnabled()) this.logJson(createProjectOutput)
    return createProjectOutput
  }
}
