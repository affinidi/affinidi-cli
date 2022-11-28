import { CliError } from '../../errors'
import { Api as IamApi, ProjectDto, CreateProjectInput, ProjectSummary } from './iam.api'

export const IAM_BASE_URL = 'https://affinidi-iam.apse1.affinidi.com'
export const IAM_URL = `${IAM_BASE_URL}/api/v1`
const SERVICE = 'iAm'

class IAmService {
  constructor(
    private readonly client = new IamApi({
      baseUrl: IAM_URL,
    }),
  ) {}

  public createProject = async (
    token: string,
    projectName: CreateProjectInput,
  ): Promise<ProjectDto> => {
    try {
      const result = await this.client.projects.createProject(projectName, {
        headers: { Cookie: token, 'content-type': 'application/json', Accept: 'application/json' },
      })
      return result.data
    } catch (error: any) {
      throw new CliError(error?.message, error.response.status, SERVICE)
    }
  }

  public getProjectSummary = async (
    token: string,
    projectId: string,
  ): Promise<ProjectSummary | null> => {
    try {
      const projectResponse = await this.client.projects.getProjectSummary(projectId, {
        headers: { Cookie: token, 'content-type': 'application/json', Accept: 'application/json' },
      })

      const projectDetails = projectResponse.data

      if (!projectDetails) {
        return null
      }
      return projectDetails
    } catch (error: any) {
      throw new CliError(error?.message, error.response.status, SERVICE)
    }
  }

  public listProjects = async (
    token: string,
    skip: number,
    limit: number,
  ): Promise<Array<ProjectDto>> => {
    try {
      const resp = await this.client.projects.listProjects({
        headers: { Cookie: token, 'content-type': 'application/json', Accept: 'application/json' },
      })
      const projectsListSize = resp.data.projects.length
      if (!resp.data || skip > projectsListSize) {
        return []
      }
      return resp.data.projects.slice(skip, skip + limit)
    } catch (error: any) {
      throw new CliError(error?.message, error.response.status, SERVICE)
    }
  }
}

const iAmService = new IAmService()

export { iAmService }
