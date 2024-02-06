import { Flags, ux } from '@oclif/core'
import z from 'zod'
import { BaseCommand } from '../../common'
import { promptRequiredParameters } from '../../common/prompts'
import { INPUT_LIMIT } from '../../common/validators'
import { bffService } from '../../services/affinidi/bff-service'
import { ProjectDto } from '../../services/affinidi/iam/iam.api'

export class UpdateProject extends BaseCommand<typeof UpdateProject> {
  static summary = 'Updates project name'
  static examples = [
    '<%= config.bin %> <%= command.id %> -n MyUpdatedProjectName',
    '<%= config.bin %> <%= command.id %> --name "My project name"',
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
  }

  public async run(): Promise<ProjectDto> {
    const { flags } = await this.parse(UpdateProject)
    const promptFlags = await promptRequiredParameters(['id', 'name'], flags)

    const schema = z.object({
      id: z.string().max(INPUT_LIMIT),
      name: z.string().max(INPUT_LIMIT),
    })
    const validatedFlags = schema.parse(promptFlags)

    ux.action.start('Updating the project name')

    const updateProjectOutput = await bffService.updateProject({
      id: validatedFlags.id,
      name: validatedFlags.name,
    })

    ux.action.stop('Updated successfully!')

    if (!this.jsonEnabled()) this.logJson(updateProjectOutput)
    return updateProjectOutput
  }
}
