import Conf from 'conf'
import * as os from 'os'
import * as path from 'path'

import { version } from '../../constants'

export const getMajorVersion = (): number => {
  return parseInt(version[0], 10)
}

type UserId = string

type UserConfig = {
  activeProjectId: string
  outputFormat: string
}

type ConfigStoreFormat = {
  version: number
  currentUserId: string
  configs: Record<UserId, UserConfig>
}

interface IConfigStorer {
  save(params: ConfigStoreFormat): void
  // clear(): void
  getVersion: () => number
  getCurrentUser: () => string
  getAllUserConfigs: () => Record<UserId, UserConfig>
}

class ConfigService {
  private readonly store: IConfigStorer

  constructor(store: IConfigStorer) {
    this.store = store
  }

  public getVersion = (): number => {
    return this.store.getVersion()
  }

  public show = (): ConfigStoreFormat => {
    const currentUserId = this.store.getCurrentUser()
    const configVersion = this.store.getVersion()
    const configs = this.store.getAllUserConfigs()
    return { version: configVersion, currentUserId, configs }
  }

  public create = (userId: string): void => {
    this.store.save({
      currentUserId: userId,
      version: getMajorVersion(),
      configs: {
        [userId]: {
          activeProjectId: '',
          outputFormat: 'plaintext',
        },
      },
    })
  }
}

const configConf = new Conf({
  cwd: path.join(os.homedir(), '.affinidi'),
  configName: 'config',
})

const store: IConfigStorer = {
  save: (params: ConfigStoreFormat): void => {
    // TODO validate the config before saving
    configConf.set('version', params.version)
    configConf.set('currentUserID', params.currentUserId)
    configConf.set('configs', params.configs)
  },

  getVersion: (): number | null => {
    const v = Number(configConf.get('version'))
    return Number.isNaN(v) ? null : v
  },

  getCurrentUser: (): string => {
    const value = configConf.get('currentUserID')
    return typeof value === 'string' ? value : ''
  },

  getAllUserConfigs: (): Record<string, UserConfig> => {
    throw new Error('Function not implemented.')
  },
}

export const testStore = new Map()
const testStorer: IConfigStorer = {
  save: (params: ConfigStoreFormat): void => {
    testStore.set('version', params.version)
    testStore.set('currentUserID', params.currentUserId)
    testStore.set('configs', params.configs)
  },
  getVersion: (): number => {
    return testStore.get('version')
  },

  getCurrentUser: (): string => {
    return testStore.get('currentUserID')
  },
  getAllUserConfigs: (): Record<string, UserConfig> => {
    return testStore.get('configs')
  },
}

export const configService = new ConfigService(process.env.NODE_ENV === 'test' ? testStorer : store)
