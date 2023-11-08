import { LoggerAdapter } from '../logger'

export interface AuthProvider {
  authenticate(): Promise<string>
}

export type AuthProviderConfig = {
  logger: LoggerAdapter
}
