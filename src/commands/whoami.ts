import { ux } from '@oclif/core'
import jwt from 'jsonwebtoken'
import { BaseCommand } from '../common'
import { clientSDK } from '../services/affinidi'
import { InvalidOrMissingAuthToken, AuthTokenExpired } from '../services/affinidi/errors'

export class WhoAmI extends BaseCommand<typeof WhoAmI> {
  static summary = "Returns user's subject and principalId from his active session"
  static examples = ['<%= config.bin %> <%= command.id %>']

  public async run() {
    ux.action.start('Retrieving user data')

    const principalId = clientSDK.config.getPrincipalId()?.split('/')[1] || clientSDK.config.getPrincipalId()
    const token = clientSDK.config.getUserToken()?.access_token

    if (!token) {
      throw new Error(InvalidOrMissingAuthToken)
    }

    ux.action.stop('Retrieved successfully!')

    const payload = jwt.decode(token)

    if (!payload || typeof payload !== 'object') {
      throw new Error(InvalidOrMissingAuthToken)
    }

    const { sub, exp } = payload

    const isJwtExpired = Date.now() >= (exp as number) * 1000

    if (isJwtExpired) {
      throw new Error(AuthTokenExpired)
    }

    if (!this.jsonEnabled()) this.logJson({ principalId, sub })

    return { principalId, sub }
  }
}
