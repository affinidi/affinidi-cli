import os from 'os'
import path from 'path'
import { Entry } from '@napi-rs/keyring'
import Conf from 'conf'
import z from 'zod'
import { config } from './env-config.js'

const sessionIdSchema = z.string()
const credentialsSchema = z.object({
  sessionId: sessionIdSchema,
})
type Credentials = z.infer<typeof credentialsSchema>
const account = 'Affinidi'
const service = 'sessionID (@affinidi/cli)'

// NOTE: `@napi-rs/keyring` manages credentials in the system's keychain.
//       On macOS the passwords are managed by the Keychain,
//       on Linux they are managed by the Secret Service API/libsecret,
//       and on Windows they are managed by the Credential Vault.
// NOTE: The `service`/`account` pair is kept identical to the one previously
//       used with `keytar`, so credentials already stored in the keychain
//       remain readable after the migration.
// NOTE: If the keychain backend is unavailable (e.g. `libsecret` is not
//       installed on Linux), CLI falls back to saving sessionId into a file.
function getKeychainEntry(): Entry {
  return new Entry(service, account)
}

class CredentialsVault {
  constructor(private readonly store: Conf<Credentials>) {}

  async clear(): Promise<void> {
    try {
      getKeychainEntry().deletePassword()
    } catch (error) {
      this.store.clear()
    }
  }

  async getSessionId(): Promise<string | null> {
    try {
      return getKeychainEntry().getPassword()
    } catch (error) {
      return this.store.get('sessionId')
    }
  }

  async setSessionId(value: string): Promise<void> {
    try {
      getKeychainEntry().setPassword(value)
    } catch (error) {
      this.store.set('sessionId', value)
    }
  }
}

const credentialConf = new Conf<Credentials>({
  configName: config.credentialsFileName,
  cwd: path.join(os.homedir(), '.affinidi'),
})

export const credentialsVault = new CredentialsVault(credentialConf)
