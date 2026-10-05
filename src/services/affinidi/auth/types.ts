import { KeyLike } from 'jose'
import { LoginAuthMethods, LoginProviders } from '../../../common/constants.js'
import { LoggerAdapter } from '../logger/logger-adapter.js'

export interface AuthProvider {
  authenticate(params: {
    privateKey: KeyLike
    publicKey: KeyLike
    provider?: LoginProviders
    authMethod?: LoginAuthMethods
  }): Promise<string>
}

export type AuthProviderConfig = {
  logger: LoggerAdapter
}
