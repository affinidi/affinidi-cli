import { ux, Flags } from '@oclif/core'
import { BaseCommand } from '../../common'
import { promptRequiredParameters } from '../../helpers'
import { clientSDK } from '../../services/affinidi'
import { iamService } from '../../services/affinidi/iam'
import { ProjectDto } from '../../services/affinidi/iam/iam.api'

export class CreateProject extends BaseCommand<typeof CreateProject> {
  static summary = 'Creates a project'
  static examples = [
    '<%= config.bin %> <%= command.id %> -n MyProjectName',
    '<%= config.bin %> <%= command.id %> --name "My project name"',
  ]
  static flags = {
    name: Flags.string({
      char: 'n',
      summary: 'Name of the project',
    }),
  }

  public async run(): Promise<ProjectDto> {
    const { flags } = await this.parse(CreateProject)
    const promptFlags = await promptRequiredParameters(['name'], flags)

    ux.action.start('Creating the project')

    const createProjectOutput = await iamService.createProject(clientSDK.config.getUserToken()?.access_token, {
      name: promptFlags.name,
    })

    ux.action.stop('Created successfully!')

    if (!this.jsonEnabled()) this.logJson(createProjectOutput)
    return createProjectOutput
  }
}
