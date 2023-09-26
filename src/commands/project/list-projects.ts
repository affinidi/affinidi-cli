import { ux } from '@oclif/core'
import { BaseCommand } from '../../common'
import { clientSDK } from '../../services/affinidi'
import { iamService } from '../../services/affinidi/iam'
import { ProjectDto } from '../../services/affinidi/iam/iam.api'

export class ListProjects extends BaseCommand<typeof ListProjects> {
  static summary = 'Lists your projects'
  static examples = ['<%= config.bin %> <%= command.id %>']

  public async run(): Promise<ProjectDto[]> {
    ux.action.start('Fetching projects')
    const listProjectsOutput = await iamService.listProjects(clientSDK.config.getUserToken()?.access_token)
    ux.action.stop('Fetched successfully!')

    if (!this.jsonEnabled()) this.logJson(listProjectsOutput)
    return listProjectsOutput
  }
}
