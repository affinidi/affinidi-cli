import { Hook } from '@oclif/core'

import { UnsuportedConfig } from '../../errors'
import { configService, validVersions } from '../../services/config'

const checkVersion: Hook<'check'> = async function () {
  if (!validVersions.includes(configService.getVersion())) {
    this.error(UnsuportedConfig)
  }
}

export default checkVersion
