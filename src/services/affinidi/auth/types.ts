import { LoggerAdapter } from '../logger'

export interface AuthProvider {
  authenticate(publicKey: string): Promise<string>
}

export type AuthProviderConfig = {
  logger: LoggerAdapter
}
