import { ux } from '@oclif/core'
import { BaseCommand } from '../../common'
import { ProjectDto } from '../../services/affinidi/iam/iam.api'
import { bffService } from '../../services/affinidi/bff-service'

export class ListProjects extends BaseCommand<typeof ListProjects> {
  static summary = 'Lists your projects'
  static examples = ['<%= config.bin %> <%= command.id %>']

  public async run(): Promise<ProjectDto[]> {
    ux.action.start('Fetching projects')
    const listProjectsOutput = await bffService.getProjects()
    ux.action.stop('Fetched successfully!')

    if (!this.jsonEnabled()) this.logJson(listProjectsOutput)
    return listProjectsOutput
  }
}
