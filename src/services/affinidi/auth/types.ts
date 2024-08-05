import { KeyLike } from 'jose'
import { LoggerAdapter } from '../logger/logger-adapter.js'

export interface AuthProvider {
  authenticate(keys: { privateKey: KeyLike; publicKey: KeyLike }): Promise<string>
}

export type AuthProviderConfig = {
  logger: LoggerAdapter
}
