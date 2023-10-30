import Conf from 'conf'
import os from 'os'
import path from 'path'
import z from 'zod'
import { config } from './env-config'

export const sessionIdSchema = z.string()
const credentialsSchema = z.object({
  sessionId: sessionIdSchema,
})
type Credentials = z.infer<typeof credentialsSchema>

class CredentialsVault {
  constructor(private readonly store: Conf<Credentials>) {}

  clear(): void {
    this.store.clear()
  }

  getSessionId(): string | undefined {
    return this.store.get('sessionId')
  }

  setSessionId(value: string): void {
    this.store.set('sessionId', value)
  }
}

const credentialConf = new Conf<Credentials>({
  configName: config.credentialsFileName,
  cwd: path.join(os.homedir(), '.affinidi'),
})

export const credentialsVault = new CredentialsVault(credentialConf)
