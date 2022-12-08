import { Hook } from '@oclif/core'
import { Hooks } from '@oclif/core/lib/interfaces'

import { UnsuportedConfig, UnsuportedCredential } from '../../errors'
import { configService, validVersions } from '../../services/config'
import { vaultService } from '../../services/vault'

export const CHECK_OPERATION = Object.freeze({
  CONFIG: 'check-config-version',
  CREDENTIALS: 'check-credentials-version',
})

type CheckOperationKeys = keyof typeof CHECK_OPERATION

type CheckVersionHookOptionType = Hooks & {
  check: { options: { id: typeof CHECK_OPERATION[CheckOperationKeys] } }
}

const checkVersion: Hook<'check', CheckVersionHookOptionType> = async function (opts) {
  let version: number
  let message = ''
  if (opts.id === CHECK_OPERATION.CONFIG) {
    version = configService.getVersion()
    message = UnsuportedConfig
  }

  // the version was either not found in the config, or there was no config file.
  if (!version) {
    return
  }
  
  if (opts.id === CHECK_OPERATION.CREDENTIALS) {
    // ToDo: implement getService() 
    // version = vaultService.getVersion()
    message = UnsuportedCredential
  }
  if (!validVersions.includes(version)) {
    this.error(message)
  }
}

export default checkVersion
