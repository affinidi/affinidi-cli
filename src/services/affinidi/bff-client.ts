import { ConsoleLoggerAdapter, LoggerAdapter } from './logger'
import { config } from '../env-config'
import { credentialsVault } from '../credentials-vault'
import { AuthProvider } from './auth/types'
import { BFFAuthProvider } from './auth/bff-auth-provider'
import { handleServiceError } from './errors'
import axios, { RawAxiosRequestHeaders } from 'axios'

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

export class BFFClient {
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
      return res.data.data
    } catch (error) {
      handleServiceError(error)
    }
  }
}

export const bffClient = new BFFClient()
