import { Hook } from '@oclif/core'
import { Hooks } from '@oclif/core/lib/interfaces'
import { configService } from '../../services'
import { validVersions } from '../../services/config'

export const UnsupportedConfig = 'Unsupported configuration version'

export const CHECK_OPERATION = Object.freeze({
  CONFIG: 'check-config-version',
  CREDENTIALS: 'check-credentials-version',
})

type CheckOperationKeys = keyof typeof CHECK_OPERATION

type CheckVersionHookOptionType = Hooks & {
  check: { options: { id: (typeof CHECK_OPERATION)[CheckOperationKeys] } }
}
export const checkVersion: Hook<'check', CheckVersionHookOptionType> = async function checkVersion(opts) {
  let version: number | undefined
  let message = ''
  if (opts.id === CHECK_OPERATION.CONFIG) {
    version = configService.getVersion()
    message = UnsupportedConfig
  }

  // the version was either not found in the config, or there was no config file.
  if (!version || !validVersions.includes(version)) {
    throw new Error(message)
  }
}
