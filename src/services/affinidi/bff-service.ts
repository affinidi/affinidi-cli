import { CLIError } from '@oclif/core/lib/errors'
import axios, { RawAxiosRequestHeaders, AxiosError } from 'axios'
import { BFFAuthProvider } from './auth/bff-auth-provider'
import { AuthProvider } from './auth/types'
import { StatsResponseOutput, StatsProjectResourceLimit } from './bff-service.types'
import { handleServiceError } from './errors'
import { CreateProjectInput, ProjectDto } from './iam/iam.api'
import { ConsoleLoggerAdapter, LoggerAdapter } from './logger'
import { ServiceResourceIds } from '../../common/constants'
import { credentialsVault } from '../credentials-vault'
import { config } from '../env-config'

/* eslint-disable-next-line @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires */
require('pkginfo')(module, 'version')

export const instance = axios.create({
  baseURL: config.bffHost,
})

export function getBFFHeaders(): RawAxiosRequestHeaders {
  return {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'Accept-Encoding': 'gzip, deflate, br',
    Cookie: `${config.bffCookieName}=${credentialsVault.getSessionId()}`,
    'affinidi-cli-version': module.exports.version,
  }
}

export class BFFService {
  private readonly logger: LoggerAdapter
  public readonly authProvider: AuthProvider

  constructor() {
    this.logger = new ConsoleLoggerAdapter(config.logLevel)
    this.authProvider = new BFFAuthProvider({
      logger: this.logger,
    })
  }

  public login(): Promise<string> {
    return this.authProvider.authenticate()
  }

  public async logout(): Promise<void> {
    try {
      await instance.post('/api/auth/logout', {}, { headers: getBFFHeaders() })
      credentialsVault.clear()
    } catch (error) {
      handleServiceError(error)
    }
  }

  public async whoami(): Promise<any> {
    try {
      const res = await instance.get('/api/whoami', { headers: getBFFHeaders() })
      return res.data
    } catch (error) {
      handleServiceError(error)
    }
  }

  public async getAuthUrl(): Promise<URL> {
    try {
      const response = await instance.get(`/api/auth-url?uxclient=${config.bffUxClient}`, { headers: getBFFHeaders() })
      return new URL(response.data.authUrl)
    } catch (error) {
      handleServiceError(error)
    }
  }

  public async getSessionId(state: string): Promise<string> {
    try {
      const res = await instance.get('/api/session-id', { params: { state: state }, headers: getBFFHeaders() })
      return res.data.sessionId
    } catch (error) {
      handleServiceError(error)
    }
  }

  public async getProjects(): Promise<ProjectDto[]> {
    const res = await instance.get('/api/projects', { headers: getBFFHeaders() })
    return res.data as ProjectDto[]
  }

  public async createProject(projectInput: CreateProjectInput): Promise<ProjectDto> {
    try {
      const res = await instance.post('/api/project', projectInput, { headers: getBFFHeaders() })
      return res.data as ProjectDto
    } catch (error) {
      if (error instanceof AxiosError && error.response?.data?.errorCodeStr === 'ProjectCreation') {
        const projectsLimit = await this.getActiveProjectLimits(ServiceResourceIds.IAM_PROJECTS)

        throw new CLIError(
          `You can create a maximum of ${projectsLimit} projects. For any further queries reach out to our Customer support.`,
        )
      }

      handleServiceError(error)
    }
  }

  public async getActiveProjectLimits(resourceId?: string): Promise<number | StatsProjectResourceLimit[] | undefined> {
    try {
      const stats = await this.stats()
      const limits = stats.projects[0].limits

      if (resourceId) {
        return limits.find((limit: StatsProjectResourceLimit) => limit.resourceId === resourceId)?.initialValue
      }

      return limits
    } catch (error) {
      handleServiceError(error)
    }
  }

  public async stats(): Promise<StatsResponseOutput> {
    try {
      const project = await this.getActiveProject()

      const res = await instance.get(`/api/stats/${project.id}`, { headers: getBFFHeaders() })
      return res.data
    } catch (error) {
      handleServiceError(error)
    }
  }

  public async getActiveProject(): Promise<ProjectDto> {
    const res = await instance.get('/api/project', { headers: getBFFHeaders() })
    return res.data as ProjectDto
  }

  public async setSessionActiveProject(projectId: string): Promise<string> {
    const res = await instance.get(`/api/projects/${projectId}`, { headers: getBFFHeaders() })
    return res.data.projectId as string
  }

  public async exportLoginConfigs(ids: string[]): Promise<any> {
    const res = await instance.post('/api/login/export-login-configs', { ids }, { headers: getBFFHeaders() })
    return res.data as any
  }

  public async importLoginConfigs(data: any): Promise<any> {
    const res = await instance.post('/api/login/import-login-configs', { data }, { headers: getBFFHeaders() })
    return res.data as any
  }

  public async exportGroups(groupNames: string[]): Promise<any> {
    const res = await instance.post('/api/login/export-user-groups', { groupNames }, { headers: getBFFHeaders() })
    return res.data as any
  }

  public async importGroups(data: any): Promise<any> {
    const res = await instance.post('/api/login/import-user-groups', { data }, { headers: getBFFHeaders() })
    return res.data as any
  }
}

export const bffService = new BFFService()