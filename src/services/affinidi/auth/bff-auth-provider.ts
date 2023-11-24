import http from 'http'
import chalk from 'chalk'
import express from 'express'
import helmet from 'helmet'
import open from 'open'
import { check } from 'tcp-port-used'
import { authResultPage } from './auth-result-page'
import { AuthProvider, AuthProviderConfig } from './types'
import { credentialsVault } from '../../credentials-vault'
import { config } from '../../env-config'
import { bffService } from '../bff-service'
import { LoggerAdapter } from '../logger'

export class BFFAuthProvider implements AuthProvider {
  private readonly logger: LoggerAdapter

  constructor({ logger }: AuthProviderConfig) {
    this.logger = logger
  }

  public async authenticate(): Promise<string> {
    const port = 64287
    const isPortInUse = await check(config.redirectPort)
    if (isPortInUse) {
      throw new Error(
        `\n💥 Port [${port}] is unavailable. Affinidi CLI is currently relying on it.\n` +
          `Please close the process that is using port [${port}] and try again.`,
      )
    }

    const authUrl = await bffService.getAuthUrl()
    const state = authUrl.searchParams.get('state')
    if (!state) {
      throw new Error('Unexpected error occurred. state parameter missing')
    }

    return new Promise<string>((resolve, reject) => {
      this.logger.debug('Start express server')

      const app = express()
      app.use(
        helmet({
          contentSecurityPolicy: {
            directives: {
              scriptSrc: ["'none'"],
            },
          },
        }),
      )
      const server = app.listen(port, () => {
        this.logger.debug(`Express server started listening on port ${port}`)
      })

      const timeout = setTimeout(() => {
        this.shutDownServer(server)
        reject(new Error(`Authentication timeout (${config.redirectTimeoutMs / 1000}s) exceeded`))
      }, config.redirectTimeoutMs)

      app.get('/callback', async (req, res) => {
        res.type('html')
        if (req.query.state === 'error') {
          this.handleError({ reject, req, res, timeout })
          this.shutDownServer(server)
        } else {
          await this.handleSuccess({ resolve, reject, res, timeout, state })
          this.shutDownServer(server)
        }
      })

      this.logger.info(
        `\nAttempting to automatically open the authentication page in your default browser.\n` +
          `\nIf the browser doesn't open automatically, or if your default browser isn't Google Chrome, please open the following URL in the Chrome browser:\n` +
          `\n${chalk.underline(authUrl)}\n\n`,
      )

      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      open(authUrl.href)
    })
  }

  /**
   * Handles `Success` case when the user accepts
   * the access to the personal data.
   * This is the example of the accept endpoint call:
   * http://127.0.0.1:64287/callback
   * @param params
   * @private
   */
  private async handleSuccess(params: {
    resolve: (value: string | PromiseLike<string>) => void
    reject: (reason?: any) => void
    res: express.Response
    timeout: NodeJS.Timeout
    state: string
  }) {
    const { resolve, reject, res, timeout, state } = params

    clearTimeout(timeout)
    try {
      this.logger.debug(`Getting sessionId for state: ${JSON.stringify(state)}`)
      const sessionId = await bffService.getSessionId(state)
      this.logger.debug(`Received session: ${JSON.stringify(sessionId)}`)
      await credentialsVault.setSessionId(sessionId)
      this.logger.debug(`Session stored in the keychain`)
      resolve(sessionId)
      res.end(
        authResultPage(
          'Logged in successfully',
          'Head back to the terminal to continue using Affinidi CLI.<br><br>You can also access our services from the <a href="https://portal.affinidi.com" target="_blank">Affindi Portal</a>',
        ),
      )
    } catch (error) {
      this.logger.info(error as string)
      const errorMessage = this.generateErrorMessage()
      reject(errorMessage)
      res.end(authResultPage('Login failed', errorMessage))
    }
  }

  /**
   * Handles `Error` case when there is an error or the
   * user rejects the access to the personal data.
   * This is the example of the reject endpoint call:
   * http://127.0.0.1:64287/callback?state=error&error=access_denied&description=request_declined
   * @param params
   * @private
   */
  private handleError(params: {
    reject: (reason?: any) => void
    req: express.Request
    res: express.Response
    timeout: NodeJS.Timeout
  }) {
    const { res, req, reject, timeout } = params
    const { type, description } = req.query
    clearTimeout(timeout)
    const errorMessage = this.generateErrorMessage(type as string, description as string)
    reject(errorMessage)
    res.end(authResultPage('Login failed', errorMessage))
  }

  private generateErrorMessage(type?: string, errorDescription?: string) {
    let errorMessage: string
    switch (type) {
      case 'access_denied':
        errorMessage =
          errorDescription === 'request_declined'
            ? 'You have declined access to your data. Granting access to your data is necessary to avail our services.'
            : 'Access denied.'
        break
      default:
        errorMessage = 'Unexpected error occurred'
    }
    return errorMessage
  }

  private shutDownServer(server: http.Server): void {
    server.close((error: unknown) => {
      if (error) {
        this.logger.error(`Error while shutting down the express server: ${(error as Error).message}`)
        return
      }
      this.logger.debug('Express server has been successfully shut down')
    })
  }
}
