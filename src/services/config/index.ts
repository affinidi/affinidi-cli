import Conf from 'conf'
import * as os from 'os'
import * as path from 'path'

import { NoUserConfigFound } from '../../errors'
import { version } from '../../constants'

export const validVersions = [1]

export const getMajorVersion = (): number => {
  return version
}

type UserId = string

type UserConfig = {
  activeProjectId: string
  outputFormat: string
  analyticsOptIn?: boolean
}

type ConfigStoreFormat = {
  username: string
  version: number
  currentUserID: string
  configs: Record<UserId, UserConfig>
}

interface IConfigStorer {
  save(params: ConfigStoreFormat): void
  clear(): void
  setOutputFormat(outputFormat: string): void
  getUsername: () => string
  getVersion: () => number
  getCurrentUser: () => string
  getAllUserConfigs: () => Record<UserId, UserConfig>
  getOutputFormat: () => string
  setCurrentProjectId: (id: string) => void
  setUsername: (username: string) => void
}

class ConfigService {
  private readonly store: IConfigStorer

  constructor(store: IConfigStorer) {
    this.store = store
  }

  public clear = (): void => {
    this.store.clear()
  }

  public getVersion = (): number => {
    return this.store.getVersion()
  }

  public show = (): ConfigStoreFormat => {
    const currentUserID = this.getCurrentUser()
    const configVersion = this.store.getVersion()
    const configs = this.store.getAllUserConfigs()
    const username = this.store.getUsername()
    return { version: configVersion, currentUserID, configs, username }
  }

  public getCurrentUser = (): string => {
    return this.store.getCurrentUser()
  }

  public getOutputFormat = (): string => {
    return this.store.getOutputFormat()
  }

  public getUsername = (): string => {
    return this.store.getUsername()
  }

  public create = (
    userId: string,
    activeProjectId: string = '',
    analyticsOptIn: boolean | undefined = undefined,
  ): void => {
    this.store.save({
      currentUserID: userId,
      version: getMajorVersion(),
      username: '',
      configs: {
        [userId]: {
          activeProjectId,
          outputFormat: 'plaintext',
          analyticsOptIn,
        },
      },
    })
  }

  public setOutputFormat = (format: string): void => {
    this.store.setOutputFormat(format)
  }

  public currentUserConfig = (): UserConfig => {
    const user = this.store.getCurrentUser()
    const configs = this.store.getAllUserConfigs()
    if (!configs[user]) {
      throw Error(NoUserConfigFound)
    }
    return configs[user]
  }

  public hasAnalyticsOptIn = (): boolean => {
    try {
      const config = this.currentUserConfig()
      return config.analyticsOptIn
    } catch (_) {
      return false
    }
  }

  public optInOrOut = (inOrOut: boolean) => {
    const userConfig = this.currentUserConfig()
    userConfig.analyticsOptIn = inOrOut
    const all = this.show()
    const user = all.currentUserID
    const updateConfigFile = {
      ...all,
      configs: Object.assign(all.configs, { [user]: { ...userConfig } }),
    }
    this.store.save(updateConfigFile)
  }

  public setCurrentProjectId = (id: string): void => {
    this.store.setCurrentProjectId(id)
  }

  public setUsername = (username: string): void => {
    this.store.setUsername(username)
  }
}

const configConf = new Conf<ConfigStoreFormat>({
  cwd: path.join(os.homedir(), '.affinidi'),
  configName: 'config',
})

const store: IConfigStorer = {
  save: (params: ConfigStoreFormat): void => {
    // TODO validate the config before saving
    configConf.set('version', params.version)
    configConf.set('currentUserID', params.currentUserID)
    configConf.set('configs', params.configs)
  },

  clear: (): void => {
    configConf.clear()
  },

  getVersion: (): number | null => {
    const v = Number(configConf.get('version'))
    return Number.isNaN(v) ? null : v
  },
  getCurrentUser: function getCurrentUser(): string {
    const value = configConf.get('currentUserID')
    return value
  },
  getAllUserConfigs: (): Record<string, UserConfig> => {
    return configConf.get('configs')
  },

  setCurrentProjectId: function setCurrentProjectId(id: string): void {
    const configs = configConf.get('configs')
    configs[this.getCurrentUser()].activeProjectId = id
    configConf.set('configs', configs)
  },
  getOutputFormat: function getOutputFormat(): string {
    const configs = configConf.get('configs')
    const userId = this.getCurrentUser()

    if (!configs || !configs[userId]) {
      return 'plaintext'
    }

    return configs[userId].outputFormat
  },
  setOutputFormat: function setOutputFormat(outputFormat: string): void {
    const configs = configConf.get('configs')
    const userId = this.getCurrentUser()
    const newUserConfig: UserConfig = {
      activeProjectId: configs[userId].activeProjectId,
      outputFormat,
    }
    configs[userId] = newUserConfig
    configConf.set('configs', configs)
  },
  getUsername: function getUsername(): string {
    return configConf.get('username')
  },
  setUsername: function setUsername(username: string): void {
    configConf.set('username', username)
  },
}

export const testStore = new Map()
const testStorer: IConfigStorer = {
  save: (params: ConfigStoreFormat): void => {
    testStore.set('version', params.version)
    testStore.set('currentUserID', params.currentUserID)
    testStore.set('configs', params.configs)
  },

  clear: (): void => {
    testStore.clear()
  },

  getVersion: (): number => {
    return testStore.get('version')
  },
  getCurrentUser: function getCurrentUser(): string {
    return testStore.get('currentUserID')
  },
  getAllUserConfigs: function getAllUserConfigs(): Record<string, UserConfig> {
    return testStore.get('configs')
  },
  setCurrentProjectId: function setCurrentProjectId(id: string): void {
    const configs = this.getAllUserConfigs()
    configs[this.getCurrentUser()].activeProjectId = id
    testStore.set('configs', configs)
  },
  getOutputFormat: function getOutputFormat(): string {
    const configs = configConf.get('configs')
    const userId = this.getCurrentUser()

    if (!configs || !configs[userId]) {
      return 'plaintext'
    }

    return configs[userId].outputFormat
  },
  setOutputFormat: function setOutputFormat(outputFormat: string): void {
    const configs = testStore.get('configs')
    const userId = this.getCurrentUser()
    const newUserConfig: UserConfig = {
      activeProjectId: configs[userId].activeProjectId,
      outputFormat,
    }
    configs[userId] = newUserConfig
    testStore.set('configs', configs)
  },
  getUsername: function getUsername(): string {
    return testStore.get('username')
  },
  setUsername: function setUsername(username: string): void {
    testStore.set('username', username)
  },
}

export const configService = new ConfigService(process.env.NODE_ENV === 'test' ? testStorer : store)
