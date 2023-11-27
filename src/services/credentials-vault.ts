import os from 'os'
import path from 'path'
import keytar from '@postman/node-keytar'
import Conf from 'conf'
import z from 'zod'
import { config } from './env-config'
import { ConsoleLoggerAdapter, LoggerAdapter } from '../services/affinidi/logger'

const sessionIdSchema = z.string()
const credentialsSchema = z.object({
  sessionId: sessionIdSchema,
})
type Credentials = z.infer<typeof credentialsSchema>
const account = 'Affinidi'
const service = 'sessionID (@affinidi/cli)'

const fallbackMessage = 'Failed to access Keychain. Using file to store `sessionId.`'

// NOTE: `keytar` allows to manage credentials in system's keychain.
//       On macOS the passwords are managed by the Keychain,
//       on Linux they are managed by the Secret Service API/libsecret,
//       and on Windows they are managed by Credential Vault.
// NOTE: `keytar` uses `libsecret` for Linux, and if that service is
//        not installed, CLI falls back to saving sessionId into file.
class CredentialsVault {
  private readonly logger: LoggerAdapter

  constructor(private readonly store: Conf<Credentials>) {
    this.logger = new ConsoleLoggerAdapter(config.logLevel)
  }

  async clear(): Promise<void> {
    try {
      await keytar.deletePassword(service, account)
    } catch (error) {
      this.logger.info(fallbackMessage)

      this.store.clear()
    }
  }

  getSessionId(): Promise<string | null> | string {
    try {
      return keytar.getPassword(service, account)
    } catch (error) {
      this.logger.info(fallbackMessage)

      return this.store.get('sessionId')
    }
  }

  setSessionId(value: string): Promise<void> | void {
    try {
      return keytar.setPassword(service, account, value)
    } catch (error) {
      this.logger.info(fallbackMessage)

      return this.store.set('sessionId', value)
    }
  }
}

const credentialConf = new Conf<Credentials>({
  configName: config.credentialsFileName,
  cwd: path.join(os.homedir(), '.affinidi'),
})

export const credentialsVault = new CredentialsVault(credentialConf)
