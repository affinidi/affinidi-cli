import { StatusCodes } from 'http-status-codes'
import { ServiceDownError, Unauthorized } from '../../errors'
import { Api as IamApi, ProjectDto, CreateProjectInput, ProjectSummary } from './iam.api'

export const IAM_URL = 'https://affinidi-iam.dev.affinity-project.org/api/v1'

class IAmService {
  constructor(
    private readonly client = new IamApi({
      baseURL: IAM_URL,
      withCredentials: true,
    }),
  ) {}

  public createProject = async (
    { token }: { token: string },
    projectName: CreateProjectInput,
  ): Promise<ProjectDto> => {
    try {
      const result = await this.client.projects.createProject(projectName, {
        headers: { Cookie: token, 'content-type': 'application/json', Accept: 'application/json' },
      })
      return result.data
    } catch (error: any) {
      //  change later to be handled golabally
      switch (error.response.status) {
        case StatusCodes.UNAUTHORIZED:
          throw Unauthorized
        case StatusCodes.INTERNAL_SERVER_ERROR:
          throw ServiceDownError
        default:
          throw new Error(error?.message)
      }
    }
  }

  public getProjectSummary = async (
    { token }: { token: string },
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
      throw new Error(error?.message)
    }
  }
}

const iAmService = new IAmService()

export { iAmService }