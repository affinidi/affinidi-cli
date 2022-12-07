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

type SessionType = {
  sessionId: 'eXtIGgjCYyf6Qu2m9ERro'
  consoleAuthToken: '<consoleAuthToken>' // without "console_authtoken=" prefix
  account: {
    label: 'carlos.r@affinidi.com'
    userId: 'fab9014e-5c79-463e-9d5f-6c16c21db93a'
  }
  scopes: []
}

type ProjectType = {
  name: string
  projectId: string
  createdAt: string
}

type ApiKeyType = {
  apiKeyHash: string
  apiKeyName: string
}

type WalletType = {
  did: string
  didUrl: string
}

type ProjectSummaryType = {
  project: ProjectType
  apiKey: ApiKeyType
  wallet: WalletType
}

type CredentialsType = {
  version: number // only for breaking changes
  session: SessionType
  activeProjectSummary: ProjectSummaryType
}

type CredentialsTypeKeys = keyof CredentialsType
type CredentialsTypeValues = CredentialsType[CredentialsTypeKeys]

interface IVaultSetterGetter {
  clear: () => void
  delete: (key: CredentialsTypeKeys) => void
  get: (key: CredentialsTypeKeys) => CredentialsTypeValues
  set: (key: CredentialsTypeKeys, value: unknown) => void
}

class VaultService {
  private readonly store: IVaultSetterGetter

  constructor(storer: IVaultSetterGetter) {
    this.store = storer
  }

  public clear = (): void => {
    this.store.clear()
  }

  public delete = (key: CredentialsTypeKeys): void => {
    this.store.delete(key)
  }

  public getVersion = (): number => {
    const v = this.store.get('version')
    return typeof v === 'number' ? v : 0
  }

  public get = (key: CredentialsTypeKeys): CredentialsTypeValues => {
    return this.store.get(key)
  }

  public set = (key: CredentialsTypeKeys, value: CredentialsTypeValues): void => {
    this.store.set(key, value)
  }
}

const testStore = new Map<CredentialsTypeKeys, CredentialsTypeValues>()
const testStorer: IVaultSetterGetter = {
  clear: () => {
    testStore.clear()
  },
  delete: (key: CredentialsTypeKeys): void => {
    testStore.delete(key)
  },
  get: (key: CredentialsTypeKeys): CredentialsTypeValues => {
    return testStore.get(key)
  },
  set: (key: CredentialsTypeKeys, value: CredentialsTypeValues): void => {
    testStore.set(key, value)
  },
}

const credentialConf = new Conf<CredentialsType>({
  cwd: path.join(os.homedir(), '.affinidi'),
  configName: 'credentials',
})

const storer: IVaultSetterGetter = {
  clear: (): void => {
    credentialConf.clear()
  },
  delete: (key: CredentialsTypeKeys): void => {
    credentialConf.delete(key)
  },
  get: (key: CredentialsTypeKeys): CredentialsTypeValues => {
    return credentialConf.get(key)
  },
  set: (key: CredentialsTypeKeys, value: string): void => {
    credentialConf.set(key, value)
  },
}

export const vaultService = new VaultService(process.env.NODE_ENV === 'test' ? testStorer : storer)
