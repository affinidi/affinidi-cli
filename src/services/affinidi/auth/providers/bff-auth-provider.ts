import http from 'http'
import { ux } from '@oclif/core'
import axios from 'axios'
import express from 'express'
import open from 'open'
import { config } from './config'
import { AuthProvider, AuthProviderConfig } from './types'
import { LoggerAdapter } from '../../adapters'
import { tokenService, UserToken } from '../token'
import { check } from 'tcp-port-used'
import cookieParser from 'cookie-parser'


export class BFFAuthProvider implements AuthProvider {

  private readonly host: string

  private readonly logger: LoggerAdapter

  private request!: Request

  constructor({ host, logger }: AuthProviderConfig) {
    this.host = host
    this.logger = logger
    const callback = `${config.redirectHost}:${config.expressPort}${config.redirectPath}`
  }

  public async authenticate(): Promise<string> {
    const port = 64287
    const isPortInUse = await check(port)
    if (isPortInUse) {
      throw new Error(`\n💥 Port [${port}] is unavailable. Affinidi CLI is currently relying on it.\n` +
      `Please close the process that is using port [${port}] and try again.`,)
    }

    const authUrl = await this.getAuthUrl()

    // this.request = request

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

      app.get('/auth/callback', async (req, res) => {
        await this.handleAllow({ resolve, req, res, timeout })
      })

      app.get('/auth/error', async (req, res) => {
        this.handleDecline({ reject, req, res, timeout })
      })

      this.logger.info(config.getAuthUrlMessage(authUrl))

      ux.action.start('Authenticating in browser')
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
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
      baseURL: process.env.BFF_BASE_URL || 'http://localhost:2777',
      withCredentials: true,
    });
    const response = await instance.get(`/api/auth-url?uxclient=${process.env.CLI_UX_CLIENT || 4}`)
    return response.data.authUrl
  }

  /**
   * Handles `Allow` case when the user accepts
   * the access to the personal data.
   * This is the example of accept endpoint call:
   * http://127.0.0.1:2777/callback?code=ory_ac_1234&scope=openid+offline_access&state=1234
   * @param params
   * @private
   */
  private async handleAllow(params: {
    resolve: (value: string | PromiseLike<string>) => void
    req: express.Request
    res: express.Response
    timeout: NodeJS.Timeout
  }) {
    const { res, req, resolve, timeout } = params
    if (req.cookies) {
      this.logger.warn(
        `Callback request has been received. Cookies: ${JSON.stringify(req.cookies)}\n----------------8<----------------------------\n`,
      )

      clearTimeout(timeout)

      // TODO tokenService.setUserToken(token)
      ux.action.stop('Authenticated successfully!')
      resolve(req.cookies)
      res.end(config.successHTML)
    }
  }

  /**
   * Handles `Decline` case when the user rejects
   * the access to the personal data
   * This is the example of the reject endpoint call:
   * http://127.0.0.1:2777/callback?error=access_denied&error_description=request_declined'
   * @param params
   * @private
   */
  private handleDecline(params: {
    reject: (reason?: any) => void
    req: express.Request
    res: express.Response
    timeout: NodeJS.Timeout
  }) {
    const { res, req, reject, timeout } = params
    const { error } = req.query
    const errorDescription = req.query.error_description

    if (error) {
      clearTimeout(timeout)

      const { errorMessage, errorPageTitle, errorPageContext } = this.generateErrorMessages(
        error as string,
        errorDescription as string | undefined,
      )

      ux.action.stop(`Authenticated failed!\n\n ${errorMessage}`)
      reject(errorMessage)
      res.end(config.erroredLoginPage(errorPageTitle, errorPageContext))
    }
  }

  private generateErrorMessages(error: string, errorDescription: string | undefined) {
    const errorPageTitle = 'Login failed'
    let errorMessage: string
    let errorPageContext: string

    switch (error) {
      case 'access_denied':
        errorMessage =
          errorDescription === 'request_declined'
            ? 'You have declined a request to access your data.\n\n'
            : `Access denied with the description: ${errorDescription}.\n\n`

        errorPageContext =
          errorDescription === 'request_declined'
            ? `You have declined permission to access your data. Granting access to your data is necessary to avail our services.<br>Please, return to the command prompt or terminal if you wish to attempt once more.`
            : `Access denied with the description: ${errorDescription}.\n\n`
        break
      default:
        errorMessage = 'Unknown problem.\n\n'
        errorPageContext = 'Specified error is unexpected'
    }

    return {
      errorPageTitle,
      errorMessage,
      errorPageContext,
    }
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
