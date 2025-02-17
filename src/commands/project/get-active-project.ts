import { ux } from '@oclif/core'
import { ProjectDto } from '@affinidi-tdk/iam-client'
import { BaseCommand } from '../../common/base-command.js'
import { bffService } from '../../services/affinidi/bff-service.js'

export class GetActiveProject extends BaseCommand<typeof GetActiveProject> {
  static summary = 'Gets the current active project'
  static examples = ['<%= config.bin %> <%= command.id %>']

  public async run(): Promise<ProjectDto> {
    ux.action.start('Getting current active project')
    const activeProject = await bffService.getActiveProject()
    ux.action.stop('Active project fetched successfully!')
    if (!this.jsonEnabled()) this.logJson(activeProject)
    return activeProject
  }
}
