import Conf from 'conf'
import * as os from 'os'
import * as path from 'path'

import { NoUserConfigFound } from '../../errors'
import { version } from '../../constants'

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
  version: number
  currentUserId: string
  configs: Record<UserId, UserConfig>
}

interface IConfigStorer {
  save(params: ConfigStoreFormat): void
  clear(): void
  getVersion: () => number
  getCurrentUser: () => string
  getAllUserConfigs: () => Record<UserId, UserConfig>
  setCurrentProjectId: (id: string) => void
  getOutputFormat: (userId: string) => string
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
    const currentUserId = this.store.getCurrentUser()
    const configVersion = this.store.getVersion()
    const configs = this.store.getAllUserConfigs()
    return { version: configVersion, currentUserId, configs }
  }
  public getOutputFormat = (userId: string) => {
    return this.store.getOutputFormat(userId)
  }
  public create = (
    userId: string,
    activeProjectId: string = '',
    analyticsOptIn: boolean | undefined = undefined,
  ): void => {
    this.store.save({
      currentUserId: userId,
      version: getMajorVersion(),
      configs: {
        [userId]: {
          activeProjectId,
          outputFormat: 'plaintext',
          analyticsOptIn,
        },
      },
    })
  }



  public currentUserConfig = (): UserConfig => {
    const user = this.store.getCurrentUser()
    const configs = this.store.getAllUserConfigs()
    if (!configs[user]) {
      throw Error(NoUserConfigFound)
    }

    return configs[user]
  }

  public hasAnalyticsOptIn = (): boolean | undefined => {
    const config = this.currentUserConfig()
    return config.analyticsOptIn
  }

  public optInOrOut = (inOrOut: boolean) => {
    const userConfig = this.currentUserConfig()
    userConfig.analyticsOptIn = inOrOut
    const all = this.show()
    const user = all.currentUserId
    const updateConfigFile = {
      ...all,
      configs: Object.assign(all.configs, { [user]: { ...userConfig } }),
    }
    this.store.save(updateConfigFile)
  }

  public setCurrentProjectId = (id: string): void => {
    this.store.setCurrentProjectId(id)
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
    configConf.set('currentUserID', params.currentUserId)
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
    return typeof value === 'string' ? value : ''
  },

  getAllUserConfigs: (): Record<string, UserConfig> => {
    return configConf.get('configs')
  },

  setCurrentProjectId: function setCurrentProjectId(id: string): void {
    const configs = configConf.get('configs')
    configs[this.getCurrentUser()].activeProjectId = id
    configConf.set('configs', configs)
  },
  getOutputFormat: (userId: string): string => {
    const configs = configConf.get('configs')
    const parsedConfigs = JSON.parse(JSON.stringify(configs))
    let outputFormat: string
    try {
      outputFormat = parsedConfigs[userId]?.outputFormat
    } catch (err) {
      outputFormat = outputFormat === undefined ? 'plaintext' : outputFormat
    }
    return outputFormat
  },
}

export const testStore = new Map()
const testStorer: IConfigStorer = {
  save: (params: ConfigStoreFormat): void => {
    testStore.set('version', params.version)
    testStore.set('currentUserID', params.currentUserId)
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
  getOutputFormat: (userId: string): string => {
    const configs = testStore.get('configs')
    let outputFormat: string
    try {
      outputFormat = configs[userId].outputFormat
    } catch (err) {
      outputFormat = outputFormat === undefined ? 'plaintext' : outputFormat
    }
    return outputFormat
  },
}

export const configService = new ConfigService(process.env.NODE_ENV === 'test' ? testStorer : store)
