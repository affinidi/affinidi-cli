import { ConsoleLoggerAdapter, LoggerAdapter } from './adapters'
import { config } from '../env-config'
import { credentialsVault } from '../credentials-vault'
import { AuthProvider } from './auth/types'
import { BFFAuthProvider } from './auth/bff-auth-provider'
import { handleServiceError } from './errors'

function getBFFHeaders(): RequestInit {
  return {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'Accept-Encoding': 'gzip, deflate, br',
      Cookie: `${config.bffCookieName}=${credentialsVault.getSessionId()}`,
    },
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

  public logout(): Promise<void> {
    credentialsVault.clear()
    return this.authProvider.logout()
  }

  public async whoami(): Promise<any> {
    try {
      const response = await fetch(`${config.bffHost}/api/whoami`, getBFFHeaders())
      return (await response.json()).data
    } catch (error) {
      handleServiceError(error)
    }
  }
}

export const bffClient = new BFFClient()
