import { LoggerAdapter } from '../../adapters'

export interface AuthProvider {
  authenticate(): Promise<string>
  logout(): Promise<void>
}

export type AuthProviderConfig = {
  clientId: string
  host: string
  logger: LoggerAdapter
}
