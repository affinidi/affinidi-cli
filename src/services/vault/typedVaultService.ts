import Conf from 'conf'
import * as os from 'os'
import * as path from 'path'
import { Unauthorized, CliError, OldCredntials } from '../../errors'
import { ProjectSummary } from '../iam/iam.api'

export const VAULT_KEYS = {
  projectId: 'active-project-id',
  projectName: 'active-project-name',
  projectAPIKey: 'active-project-api-key',
  projectDID: 'active-project-did',
  session: 'session',
}

export type SessionType = {
  sessionId: string
  consoleAuthToken: string // without "console_authtoken=" prefix '<consoleAuthToken>'
  account: {
    label: string
    userId: string
  }
  scopes: string[]
}

type CredentialsType = {
  version: number // only for breaking changes
  session: SessionType
  actisveProjectSummary: ProjectSummary
  timeStamp: number
}

export type CredentialsTypeKeys = keyof CredentialsType
type CredentialsTypeValues = CredentialsType[CredentialsTypeKeys]

interface IVaultSetterGetter {
  clear: () => void
  delete: (key: CredentialsTypeKeys) => void
  getSession: () => SessionType
  setSession: (session: SessionType) => void
  getActiveProject: () => ProjectSummary
  setActiveProject: (project: ProjectSummary) => void
  getDate: () => number
  setDate: () => void
  deleteDate: () => void
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

  public getSession = (): SessionType => {
    const session = this.store.getSession()
    if (typeof session === 'string') {
      throw new CliError(OldCredntials, 0, 'vault')
    }
    if (session && !session.consoleAuthToken.includes('console_authtoken=')) {
      session.consoleAuthToken = `console_authtoken=${session.consoleAuthToken}`
    }
    return session
  }

  public setSession = (session: SessionType): void => {
    this.store.setSession(session)
  }

  public getActiveProject = (): ProjectSummary => {
    const activeProject = this.store.getActiveProject()
    if (!activeProject) {
      throw new CliError(Unauthorized, 401, 'vault')
    }
    return activeProject
  }

  public setActiveProject = (project: ProjectSummary): void => {
    this.store.setActiveProject(project)
  }

  public getTimeStamp = (): number => {
    return this.store.getDate()
  }

  public setTimeStamp = (): void => {
    this.store.setDate()
  }

  public deleteTimeStamp = (): void => {
    this.store.deleteDate()
  }
}

const testStore = new Map()
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
  getSession: function getSession(): SessionType {
    return testStore.get('session')
  },
  setSession: function setSession(session: SessionType): void {
    testStore.set('session', session)
  },
  getActiveProject: function getActiveProject(): ProjectSummary {
    return testStore.get('activeProjectSummary')
  },
  setActiveProject: function setActiveProject(project: ProjectSummary): void {
    testStore.set('activeProjectSummary', project)
  },
  getDate: function getDate(): number {
    return testStore.get('timeStamp')
  },
  setDate: function setDate(): void {
    testStore.set('timeStamp', Date.now())
  },
  deleteDate: function deletDate(): void {
    testStore.delete('timeStamp')
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
  getSession: function getSession(): SessionType {
    return credentialConf.get('session')
  },
  setSession: function setSession(session: SessionType): void {
    credentialConf.set('session', session)
  },
  getActiveProject: function getActiveProject(): ProjectSummary {
    return credentialConf.get('activeProjectSummary')
  },
  setActiveProject: function setActiveProject(project: ProjectSummary): void {
    credentialConf.set('activeProjectSummary', project)
  },
  getDate: function getDate(): number {
    return credentialConf.get('timeStamp')
  },
  setDate: function setDate(): void {
    credentialConf.set('timeStamp', Date.now())
  },
  deleteDate: function deleteDate(): void {
    credentialConf.delete('timeStamp')
  },
}

export const vaultService = new VaultService(process.env.NODE_ENV === 'test' ? testStorer : storer)
