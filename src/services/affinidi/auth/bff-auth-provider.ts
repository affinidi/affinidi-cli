import http from 'http'
import axios from 'axios'
import express from 'express'
import open from 'open'
import { AuthProvider, AuthProviderConfig } from './types'
import { LoggerAdapter } from '../adapters'
import { check } from 'tcp-port-used'
import cookieParser from 'cookie-parser'
import { authResultPage } from './auth-result-page'
import chalk from 'chalk'
import { config } from '../../env-config'
import { credentialsVault, sessionIdSchema } from '../../credentials-vault'

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

    const authUrl = await this.getAuthUrl()

    return new Promise<string>((resolve, reject) => {
      this.logger.debug('Start express server')

      const app = express()
      app.use(cookieParser())
      const server = app.listen(port, () => {
        this.logger.debug(`Express server started listening on port ${port}`)
      })

      const timeout = setTimeout(() => {
        this.shutDownServer(server)
        reject(new Error(`Authentication timeout (${config.redirectTimeoutMs / 1000}s) exceeded`))
      }, config.redirectTimeoutMs)

      app.get('/callback', async (req, res) => {
        if (req.query.state === 'error') {
          this.handleError({ reject, req, res, timeout })
          this.shutDownServer(server)
        } else {
          await this.handleSuccess({ resolve, reject, req, res, timeout })
          this.shutDownServer(server)
        }
      })

      this.logger.info(
        `\nAttempting to automatically open the authentication page in your default browser.\n` +
          `\nIf the browser doesn't open automatically, or if your default browser isn't Google Chrome, please open the following URL in the Chrome browser:\n` +
          `\n${chalk.underline(authUrl)}\n\n`,
      )

      open(authUrl)
    })
  }

  public async logout(): Promise<void> {
    return new Promise<void>((resolve) => {
      resolve()
    })
  }

  private async getAuthUrl(): Promise<string> {
    const instance = axios.create({
      baseURL: config.bffHost,
      withCredentials: true,
    })
    const response = await instance.get(`/api/auth-url?uxclient=${config.bffUxClient}`)
    return response.data.authUrl
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
    req: express.Request
    res: express.Response
    timeout: NodeJS.Timeout
  }) {
    const { resolve, reject, req, res, timeout } = params
    clearTimeout(timeout)
    try {
      const sessionId = sessionIdSchema.parse(req.cookies[config.bffCookieName])
      this.logger.debug(`Received session: ${JSON.stringify(sessionId)}`)
      credentialsVault.setSessionId(sessionId)
      this.logger.debug(`Session stored in vault`)
      resolve(sessionId)
      res.end(
        authResultPage(
          'Logged in successfully',
          'Head back to the terminal to continue using Affinidi CLI.<br><br>You can also access our services from the <a href="https://portal.affinidi.com" target="_blank">Affindi Portal</a>',
        ),
      )
    } catch (error) {
      this.logger.debug(error as string)
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
            : `Access denied with the description: ${errorDescription}.`
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
