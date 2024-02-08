import { CLIError } from '@oclif/core/lib/errors'
import axios, { AxiosError, RawAxiosRequestHeaders } from 'axios'
import { KeyLike, generateKeyPair } from 'jose'
import { BFFAuthProvider } from './auth/bff-auth-provider'
import { AuthProvider } from './auth/types'
import { StatsProjectResourceLimit, StatsResponseOutput } from './bff-service.types'
import { handleServiceError } from './errors'
import { CreateProjectInput, ProjectDto, UpdateProjectInput } from './iam/iam.api'
import { ConsoleLoggerAdapter, LoggerAdapter } from './logger'
import { ServiceResourceIds, SupportedAlgorithms } from '../../common/constants'
import { credentialsVault } from '../credentials-vault'
import { config } from '../env-config'

/* eslint-disable-next-line @typescript-eslint/ban-ts-comment, @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires */
require('pkginfo')(module, 'version')

export const instance = axios.create({
  baseURL: config.bffHost,
})

export async function getBFFHeaders(): Promise<RawAxiosRequestHeaders> {
  const sessionId = await credentialsVault.getSessionId()
  return {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'Accept-Encoding': 'gzip, deflate, br',
    Cookie: `${config.bffCookieName}=${sessionId}`,
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

  public async login(): Promise<string> {
    const { privateKey, publicKey } = await this.generateKeyPair()
    return this.authProvider.authenticate({ privateKey, publicKey })
  }

  public async logout(): Promise<void> {
    const headers = await getBFFHeaders()
    try {
      await instance.post('/api/auth/logout', {}, { headers })
      await credentialsVault.clear()
    } catch (error) {
      handleServiceError(error)
    }
  }

  public async whoami(): Promise<any> {
    const headers = await getBFFHeaders()
    try {
      const res = await instance.get('/api/whoami', { headers })
      return res.data
    } catch (error) {
      handleServiceError(error)
    }
  }

  public async postAuthUrl(publicKey: string): Promise<URL> {
    try {
      const response = await instance.post<{ authUrl: string }>(
        '/api/auth/url',
        { publicKey, uxClient: config.bffUxClient },
        { headers: await getBFFHeaders() },
      )
      return new URL(response.data.authUrl)
    } catch (error) {
      handleServiceError(error)
    }
  }

  public async getSessionId(state: string): Promise<string> {
    const headers = await getBFFHeaders()
    try {
      const res = await instance.get('/api/session-id', { params: { state: state }, headers })
      return res.data.sessionId
    } catch (error) {
      handleServiceError(error)
    }
  }

  public async getProjects(): Promise<ProjectDto[]> {
    const headers = await getBFFHeaders()
    try {
      const res = await instance.get('/api/projects', { headers })
      return res.data as ProjectDto[]
    } catch (error) {
      handleServiceError(error)
    }
  }

  public async createProject(projectInput: CreateProjectInput): Promise<ProjectDto> {
    const headers = await getBFFHeaders()
    try {
      const res = await instance.post('/api/project', projectInput, { headers })
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

  public async updateProject(projectInput: UpdateProjectInput): Promise<ProjectDto> {
    const headers = await getBFFHeaders()
    try {
      const res = await instance.patch('/api/project', projectInput, { headers })
      return res.data as ProjectDto
    } catch (error) {
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
    const headers = await getBFFHeaders()
    try {
      const project = await this.getActiveProject()

      const res = await instance.get(`/api/stats/${project.id}`, { headers })
      return res.data
    } catch (error) {
      handleServiceError(error)
    }
  }

  public async getActiveProject(): Promise<ProjectDto> {
    const headers = await getBFFHeaders()
    try {
      const res = await instance.get('/api/project', { headers })
      return res.data as ProjectDto
    } catch (error) {
      handleServiceError(error)
    }
  }

  public async setSessionActiveProject(projectId: string): Promise<string> {
    const headers = await getBFFHeaders()
    try {
      const res = await instance.get(`/api/projects/${projectId}`, { headers })
      return res.data.projectId as string
    } catch (error) {
      handleServiceError(error)
    }
  }

  public async exportLoginConfigs(ids: string[]): Promise<any> {
    const headers = await getBFFHeaders()
    try {
      const res = await instance.post('/api/login/export-login-configs', { ids }, { headers })
      return res.data as any
    } catch (error) {
      handleServiceError(error)
    }
  }

  public async importLoginConfigs(data: any): Promise<any> {
    const headers = await getBFFHeaders()
    try {
      const res = await instance.post('/api/login/import-login-configs', { data }, { headers })
      return res.data as any
    } catch (error) {
      handleServiceError(error)
    }
  }

  public async exportGroups(groupNames: string[]): Promise<any> {
    const headers = await getBFFHeaders()
    try {
      const res = await instance.post('/api/login/export-user-groups', { groupNames }, { headers })
      return res.data as any
    } catch (error) {
      handleServiceError(error)
    }
  }

  public async importGroups(data: any): Promise<any> {
    const headers = await getBFFHeaders()
    try {
      const res = await instance.post('/api/login/import-user-groups', { data }, { headers })
      return res.data as any
    } catch (error) {
      handleServiceError(error)
    }
  }

  public async generateKeyPair(): Promise<{ publicKey: KeyLike; privateKey: KeyLike }> {
    const { publicKey, privateKey } = await generateKeyPair(SupportedAlgorithms.RS256)
    return { publicKey, privateKey }
  }
}

export const bffService = new BFFService()
