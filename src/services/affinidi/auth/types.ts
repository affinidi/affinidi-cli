import { LoggerAdapter } from '../logger'

export interface AuthProvider {
  authenticate(keys: { privateKey: string; publicKey: string }): Promise<string>
}

export type AuthProviderConfig = {
  logger: LoggerAdapter
}
