import axios, { RawAxiosRequestHeaders } from 'axios'
import { BFFAuthProvider } from './auth/bff-auth-provider'
import { AuthProvider } from './auth/types'
import { handleServiceError } from './errors'
import { CreateProjectInput, ProjectDto } from './iam/iam.api'
import { ConsoleLoggerAdapter, LoggerAdapter } from './logger'
import { credentialsVault } from '../credentials-vault'
import { config } from '../env-config'

export const instance = axios.create({
  baseURL: config.bffHost,
})

export function getBFFHeaders(): RawAxiosRequestHeaders {
  return {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'Accept-Encoding': 'gzip, deflate, br',
    Cookie: `${config.bffCookieName}=${credentialsVault.getSessionId()}`,
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
      await instance.get('/api/logout', { headers: getBFFHeaders() })
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
      const response = await instance.get(`/api/auth-url?uxclient=${config.bffUxClient}`)
      return new URL(response.data.authUrl)
    } catch (error) {
      handleServiceError(error)
    }
  }

  public async getSessionId(state: string): Promise<string> {
    try {
      const res = await instance.get('/api/session-id', { params: { state: state } })
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
    const res = await instance.post('/api/project', projectInput, { headers: getBFFHeaders() })
    return res.data as ProjectDto
  }

  public async getActiveProject(): Promise<ProjectDto> {
    const res = await instance.get('/api/project', { headers: getBFFHeaders() })
    return res.data as ProjectDto
  }

  public async setSessionActiveProject(projectId: string): Promise<string> {
    const res = await instance.get(`/api/projects/${projectId}`, { headers: getBFFHeaders() })
    return res.data.projectId as string
  }
}

export const bffService = new BFFService()
