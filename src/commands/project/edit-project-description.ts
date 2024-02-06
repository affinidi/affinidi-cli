import { Flags, ux } from '@oclif/core'
import z from 'zod'
import { BaseCommand } from '../../common'
import { promptRequiredParameters } from '../../common/prompts'
import { INPUT_LIMIT } from '../../common/validators'
import { bffService } from '../../services/affinidi/bff-service'
import { ProjectDto } from '../../services/affinidi/iam/iam.api'

export class UpdateProject extends BaseCommand<typeof UpdateProject> {
  static summary = 'Updates project description'
  static examples = [
    '<%= config.bin %> <%= command.id %> -d MyUpdatedProjectDescription',
    '<%= config.bin %> <%= command.id %> --description "My Updated Project Description"',
  ]
  static flags = {
    id: Flags.string({
      char: 'i',
      summary: 'Project Id',
    }),
    description: Flags.string({
      char: 'd',
      summary: 'Description of the project',
    }),
  }

  public async run(): Promise<ProjectDto> {
    const { flags } = await this.parse(UpdateProject)
    const promptFlags = await promptRequiredParameters(['id', 'description'], flags)

    const schema = z.object({
      id: z.string().max(INPUT_LIMIT),
      description: z.string().max(INPUT_LIMIT),
    })
    const validatedFlags = schema.parse(promptFlags)

    ux.action.start('Updating the project description')

    const updateProjectOutput = await bffService.updateProject({
      id: validatedFlags.id,
      description: validatedFlags.description,
    })

    ux.action.stop('Updated successfully!')

    if (!this.jsonEnabled()) this.logJson(updateProjectOutput)
    return updateProjectOutput
  }
}
