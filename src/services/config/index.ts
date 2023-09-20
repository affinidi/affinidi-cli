import * as os from 'os'
import * as path from 'path'
import Conf from 'conf'
import { clientSDK } from '../affinidi'

const NoUserConfigFound = 'No user configurations were found, to create a configuration please log-in again.'
const NoConfigFile = "The config file doesn't exist, please log-in again"

export const version = 2
export const validVersions = [2]

export const getMajorVersion = (): number => {
  return version
}

// eslint-disable-next-line @typescript-eslint/ban-types
type UserConfig = {}

type ConfigStoreFormat = {
  version?: number
  currentUserId: string
  configs: Record<string, UserConfig>
}

interface IConfigStorer {
  save(params: ConfigStoreFormat): void
  clear(): void
  getVersion: () => number | undefined
  getCurrentUser: () => string
  getAllUserConfigs: () => Record<string, UserConfig>
  deleteUserConfig: () => void
}

class ConfigService {
  private readonly store: IConfigStorer

  constructor(store: IConfigStorer) {
    this.store = store
  }

  public clear = (): void => {
    this.store.clear()
  }

  public getVersion = (): number | undefined => {
    return this.store.getVersion()
  }

  public show = (): ConfigStoreFormat => {
    const currentUserId = clientSDK.auth.getPrincipalId()
    const configVersion = this.store.getVersion()
    const configs = this.store.getAllUserConfigs()
    return { version: configVersion, currentUserId, configs }
  }

  private readonly userConfigMustExist = (): void => {
    this.configFileMustExist()
    const userId = this.getCurrentUser()
    const configs = this.store.getAllUserConfigs()
    if (!configs || !(userId in configs)) {
      throw new Error(NoUserConfigFound)
    }
  }

  private readonly configFileMustExist = (): void => {
    const versionConf = this.store.getVersion()
    if (versionConf === null || versionConf === undefined) {
      throw new Error(NoConfigFile)
    }
  }

  private readonly configFileExists = (): boolean => {
    try {
      this.configFileMustExist()
      return true
    } catch (error) {
      return false
    }
  }

  public getCurrentUser = (): string => {
    return clientSDK.auth.getPrincipalId()
  }

  public create = (userId: string): void => {
    this.store.save({
      currentUserId: userId,
      version: getMajorVersion(),
      configs: {
        [userId]: {},
      },
    })
  }

  public updateConfigs = (userId: string): Record<string, UserConfig> => {
    const configs = this.store.getAllUserConfigs()
    if (!configs[userId]) {
      configs[userId] = {}
    } else {
      configs[userId] = {}
    }
    return configs
  }

  public createOrUpdate = (userId: string): void => {
    let configs = this.store.getAllUserConfigs()
    if (!this.configFileExists() || !configs) {
      this.create(userId)
      return
    }

    configs = this.updateConfigs(userId)
    this.store.save({
      currentUserId: userId,
      version: getMajorVersion(),
      configs,
    })
  }

  public currentUserConfig = (): UserConfig => {
    const user = clientSDK.auth.getPrincipalId()
    const configs = this.store.getAllUserConfigs()
    if (!configs[user]) {
      throw Error(NoUserConfigFound)
    }
    return configs[user]
  }

  public deleteUserConfig = (): void => {
    this.store.deleteUserConfig()
  }
}

const configConf = new Conf<ConfigStoreFormat>({
  cwd: path.join(os.homedir(), '.affinidi'),
  configName: 'config-v2',
})

const store: IConfigStorer = {
  save: (params: ConfigStoreFormat): void => {
    // TODO validate the config before saving
    configConf.set('version', params.version)
    configConf.set('configs', params.configs)
  },

  clear: (): void => {
    configConf.clear()
  },

  getVersion: (): number | undefined => {
    const v = Number(configConf.get('version'))
    return Number.isNaN(v) ? undefined : v
  },
  getAllUserConfigs: (): Record<string, UserConfig> => {
    return configConf.get('configs')
  },
  getCurrentUser: (): string => {
    return clientSDK.auth.getPrincipalId()
  },
  deleteUserConfig: function deleteUserConfig(): void {
    const userId = this.getCurrentUser()
    const configs = configConf.get('configs')
    delete configs[userId]
    configConf.set('configs', configs)
  },
}

export const testStore = new Map()
const testStorer: IConfigStorer = {
  save: (params: ConfigStoreFormat): void => {
    testStore.set('version', params.version)
    testStore.set('currentUserId', params.currentUserId)
    testStore.set('configs', params.configs)
  },

  clear: (): void => {
    testStore.clear()
  },

  getVersion: (): number => {
    return testStore.get('version')
  },
  getCurrentUser: (): string => {
    return testStore.get('currentUserId')
  },
  getAllUserConfigs: function getAllUserConfigs(): Record<string, UserConfig> {
    return testStore.get('configs')
  },

  deleteUserConfig: function deleteUserConfig(): void {
    const configs = testStore.get('configs')
    const userId = this.getCurrentUser()
    delete configs[userId]
    testStore.set('configs', configs)
  },
}

export const configService = new ConfigService(process.env.NODE_ENV === 'test' ? testStorer : store)
