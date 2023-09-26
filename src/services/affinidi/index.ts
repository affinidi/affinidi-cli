import * as process from 'process'
import { ConsoleLoggerAdapter, LoggerAdapter } from './adapters'
import { Auth, AuthResult, AuthSDK } from './auth'
import { tokenService } from './auth/token'
import { ClientSDKConfig, Environment } from './config'

// This is a class of the ClientSDK. The ClientSDK is currently a work in progress,
// and the Affinidi CLI reuses components from the project.
//
// Upon completion of the ClientSDK, the implementation should be migrated back to it.
export class ClientSDK {
  private readonly clientId: string

  private readonly host: string

  private readonly environment: Environment

  private readonly logger: LoggerAdapter

  public readonly auth: AuthSDK

  public readonly config: typeof tokenService

  constructor(config: ClientSDKConfig) {
    this.clientId = config.authConfig.clientId
    this.host = config.authConfig.host
    this.environment = config.environment || 'dev'
    this.logger = config.logger || new ConsoleLoggerAdapter(config.logLevel || 'info')
    this.config = tokenService

    this.auth = new Auth({
      logger: this.logger,
      clientId: this.clientId,
      host: this.host,
    })
  }

  /**
   * Onboards a builder and generates a project-scoped token
   * @returns Project-Scoped token
   */
  public login(params: {
    projectId?: string
    userAccessToken?: string
    hideProjectHints?: boolean
  }): Promise<AuthResult> {
    return this.auth.login(params)
  }

  public logout(): Promise<void> {
    this.config.clear()
    return this.auth.logout()
  }
}

const clientId =
  process.env.AFFINIDI_CLI_ENVIRONMENT === 'dev' || process.env.AFFINIDI_CLI_ENVIRONMENT === 'test'
    ? '7ea59d10-0546-400f-ba0a-862fa119465e'
    : '5540a110-5505-4127-9bd7-301122f99ce1'
const host =
  process.env.AFFINIDI_CLI_ENVIRONMENT === 'dev' || process.env.AFFINIDI_CLI_ENVIRONMENT === 'test'
    ? 'https://boring-galileo-bjhg4t85fi.projects.oryapis.com'
    : 'https://euw1.elements.auth.affinidi.io'

const clientSDK = new ClientSDK({
  authConfig: { clientId, host },
  // NOTE: log level should NOT be only debug
  logLevel: process.env.AFFINIDI_CLI_DEBUG === 'true' ? 'debug' : 'info',
  component: 'Cli',
})

export { clientSDK }
