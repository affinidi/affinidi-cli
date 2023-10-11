import { ux } from '@oclif/core'
import jwt from 'jsonwebtoken'
import { BaseCommand } from '../common'
import { clientSDK } from '../services/affinidi'
import { InvalidOrMissingAuthToken, AuthTokenExpired } from '../services/affinidi/errors'
import { CLIError } from '@oclif/core/lib/errors'

export class WhoAmI extends BaseCommand<typeof WhoAmI> {
  static summary = "Returns user's subject and principalId from his active session"
  static examples = ['<%= config.bin %> <%= command.id %>']

  public async run() {
    ux.action.start('Retrieving user data')

    const principal = clientSDK.config.getPrincipal()
    const token = clientSDK.config.getUserToken()?.access_token

    if (!token || !principal) {
      throw new CLIError(InvalidOrMissingAuthToken)
    }

    ux.action.stop('Retrieved successfully!')

    const payload = jwt.decode(token)

    if (!payload || typeof payload !== 'object') {
      throw new CLIError(InvalidOrMissingAuthToken)
    }

    const { sub, exp } = payload

    const isJwtExpired = Date.now() >= (exp as number) * 1000

    if (isJwtExpired) {
      throw new CLIError(AuthTokenExpired)
    }

    if (!this.jsonEnabled()) this.logJson({ principal, sub })

    return { principal, sub }
  }
}
