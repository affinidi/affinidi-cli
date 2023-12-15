import { KeyLike } from 'jose'
import { LoggerAdapter } from '../logger'

export interface AuthProvider {
  authenticate(keys: { privateKey: KeyLike; publicKey: KeyLike }): Promise<string>
}

export type AuthProviderConfig = {
  logger: LoggerAdapter
}
