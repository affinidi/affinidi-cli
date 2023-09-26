import { ux } from '@oclif/core'
import { BaseCommand } from '../../common'
import { tokenService, ProjectToken } from '../../services/affinidi/auth/token'
import { ProjectDto } from '../../services/affinidi/iam/iam.api'

export class GetActiveProject extends BaseCommand<typeof GetActiveProject> {
  static summary = 'Gets the current active project'
  static examples = ['<%= config.bin %> <%= command.id %>']

  public async run(): Promise<ProjectDto> {
    ux.action.start('Getting current active project')
    const projectToken: ProjectToken = tokenService.getProjectToken()
    ux.action.stop('Active project listed successfully!')

    const response: ProjectDto = { id: projectToken?.projectId, name: projectToken?.projectName }
    if (!this.jsonEnabled()) this.logJson(response)
    return response
  }
}
