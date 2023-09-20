import chalk from 'chalk'
import { check } from 'tcp-port-used'
import { declinedLoginPage } from './declined-login-page'
import { successfulLoginPage } from './successful-login-page'

const oryAuthCallbackPort = 2777

export const isOryAuthCallbackPortInUse = async () => {
  return check(oryAuthCallbackPort)
}

export const config = {
  redirectHost: 'http://127.0.0.1',
  expressPort: oryAuthCallbackPort,
  redirectPath: '/callback',
  redirectTimeoutMs: 5 * 60 * 1000,

  codeChallengeMethod: 'S256',
  stateBytes: 32,
  PKCEBytes: 64,
  scope: 'openid offline_access',

  getSSOMessage: (ssoUrl: string) => {
    return (
      `\nAttempting to automatically open the SSO authorization page in your default browser.\n` +
      `\nIf the browser doesn't open automatically, or if your default browser isn't Google Chrome, please open the following URL in the Chrome browser:\n` +
      `\n${chalk.underline(ssoUrl)}\n`
    )
  },
  successHTML: successfulLoginPage,
  declinedHTML: declinedLoginPage,
  oryAuthCallbackPortUnavailableMessage:
    `\n💥 Port [${oryAuthCallbackPort}] is unavailable. Affinidi CLI is currently relying on it.\n` +
    `Please close the process that is using port [${oryAuthCallbackPort}] and try again.`,
}
