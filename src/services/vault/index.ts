import Conf from 'conf'
import * as os from 'os'
import * as path from 'path'

export const VAULT_KEYS = {
  projectId: 'active-project-id',
  projectName: 'active-project-name',
  projectAPIKey: 'active-project-api-key',
  projectDID: 'active-project-did',
  session: 'session',
}

const doNothing = () => {}

interface IVaultSetterGetter {
  clear: () => void
  delete: (key: string) => void
  get(key: string): string | null
  set(key: string, value: string): void
}

class VaultService {
  private readonly storer: IVaultSetterGetter

  constructor(storer: IVaultSetterGetter) {
    this.storer = storer
  }

  public clear = (): void => {
    this.storer.clear()
  }

  public delete = (key: string): void => {
    this.storer.delete(key)
  }

  public get = (key: string): string | null => {
    const value = this.storer.get(key)
    return typeof value === 'string' ? value : null
  }

  public set = (key: string, value: string): void => {
    this.storer.set(key, value)
  }
}

const testStore = new Map()
const testStorer: IVaultSetterGetter = {
  clear: doNothing,
  delete: (key: string): void => {
    testStore.delete(key)
  },
  get: (key: string): string => {
    const value = testStore.get(key)
    return typeof value === 'string' ? value : null
  },
  set: (key: string, value: string): void => {
    testStore.set(key, value)
  },
}

const credentialConf = new Conf({
  cwd: path.join(os.homedir(), '.affinidi', 'credentials'),
})

const storer: IVaultSetterGetter = {
  clear: (): void => {
    credentialConf.clear()
  },
  delete: (key: string): void => {
    credentialConf.delete(key)
  },
  get: (key: string): string | null => {
    const value = credentialConf.get(key)
    return typeof value === 'string' ? value : null
  },
  set: (key: string, value: string): void => {
    credentialConf.set(key, value)
  },
}

export const vaultService = new VaultService(process.env.NODE_ENV === 'test' ? testStorer : storer)
