import chalk from 'chalk'
import { check } from 'tcp-port-used'
import { erroredLoginPage } from './error-login-page'
import { successfulLoginPage } from './successful-login-page'

const oryAuthCallbackPort = 2777

export const config = {
  redirectHost: 'http://127.0.0.1',
  expressPort: oryAuthCallbackPort,
  redirectPath: '/callback',
  redirectTimeoutMs: 5 * 60 * 1000,

  codeChallengeMethod: 'S256',
  stateBytes: 32,
  PKCEBytes: 64,
  scope: 'openid offline_access',

  getAuthUrlMessage: (authUrl: string) => {
    return (
      `\nAttempting to automatically open the authentication page in your default browser.\n` +
      `\nIf the browser doesn't open automatically, or if your default browser isn't Google Chrome, please open the following URL in the Chrome browser:\n` +
      `\n${chalk.underline(authUrl)}\n`
    )
  },
  successHTML: successfulLoginPage,
  erroredLoginPage: erroredLoginPage,
}
