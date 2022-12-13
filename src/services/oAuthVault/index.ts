import Conf from 'conf'
import * as os from 'os'
import * as path from 'path'

type CredTypes = {
  access_token: string
  expires_in: number
  id_token: string
  scope: string
  token_type: string
  expiresat: Date
}
interface NewCredSetterGetter {
  clear: () => void
  get: () => CredTypes
  set: (token: CredTypes) => void
}

class NewVaultService {
  private readonly store: NewCredSetterGetter

  constructor(storer: NewCredSetterGetter) {
    this.store = storer
  }

  public get = (): CredTypes => {
    return this.store.get()
  }

  public set = (token: CredTypes): void => {
    this.store.set(token)
  }

  public clear = (): void => {
    this.store.clear()
  }
}

const credentialConf = new Conf<CredTypes>({
  cwd: path.join(os.homedir(), '.affinidi'),
  configName: 'oAuthCred',
})

const storer: NewCredSetterGetter = {
  clear: (): void => {
    credentialConf.clear()
  },
  get: (): CredTypes => {
    return credentialConf.get('token')
  },
  set: (token: CredTypes): void => {
    credentialConf.set('token', token)
  },
}

export const newVaultService = new NewVaultService(storer)
