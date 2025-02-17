import { Flags, ux } from '@oclif/core'
import z from 'zod'
import { ProjectDto } from '@affinidi-tdk/iam-client'
import { BaseCommand } from '../../common/base-command.js'
import { promptRequiredParameters } from '../../common/prompts.js'
import { INPUT_LIMIT } from '../../common/validators.js'
import { bffService } from '../../services/affinidi/bff-service.js'

export class UpdateProject extends BaseCommand<typeof UpdateProject> {
  static summary = 'Updates project details'
  static examples = [
    '<%= config.bin %> <%= command.id %> -n MyUpdatedProjectName -d MyUpdatedProjectDescription',
    '<%= config.bin %> <%= command.id %> --name="My project name" --description="My project description',
  ]
  static flags = {
    id: Flags.string({
      char: 'i',
      summary: 'Project Id',
    }),
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
    const { flags } = await this.parse(UpdateProject)
    const promptFlags = await promptRequiredParameters(['id'], flags)

    const schema = z.object({
      id: z.string().max(INPUT_LIMIT),
      name: z.string().max(INPUT_LIMIT).optional(),
      description: z.string().max(INPUT_LIMIT).optional(),
    })
    const validatedFlags = schema.parse(promptFlags)

    ux.action.start('Updating the project')

    const updateProjectOutput = await bffService.updateProject(validatedFlags.id, {
      name: validatedFlags?.name ?? undefined,
      description: validatedFlags?.description ?? undefined,
    })

    ux.action.stop('Updated successfully!')

    if (!this.jsonEnabled()) this.logJson(updateProjectOutput)
    return updateProjectOutput
  }
}
