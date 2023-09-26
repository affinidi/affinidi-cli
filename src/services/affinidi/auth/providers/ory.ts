import { randomUUID } from 'crypto'
import http from 'http'
import { ux } from '@oclif/core'
import express from 'express'
import open from 'open'
import { AccessToken, AuthorizationCode } from 'simple-oauth2'
import { config, isOryAuthCallbackPortInUse } from './config'
import { AuthProvider } from './types'
import { LoggerAdapter } from '../../adapters'
import { tokenService, UserToken } from '../token'

const REDIRECT_URI = `${config.redirectHost}:${config.expressPort}${config.redirectPath}`

export type AuthProviderConfig = {
  clientId: string
  host: string
  logger: LoggerAdapter
}

export class OryAuthenticator implements AuthProvider {
  private readonly clientId: string

  private readonly host: string

  private readonly logger: LoggerAdapter

  constructor({ clientId, host, logger }: AuthProviderConfig) {
    this.clientId = clientId
    this.host = host
    this.logger = logger
  }

  private createAuthorizationClient(): AuthorizationCode {
    return new AuthorizationCode({
      client: {
        id: this.clientId,
        secret: '',
      },
      auth: {
        tokenHost: this.host,
        authorizePath: '/oauth2/auth',
        tokenPath: '/oauth2/token',
      },
    })
  }

  private async exchangeForToken(client: AuthorizationCode, code: string): Promise<AccessToken> {
    const accessToken = await client.getToken({
      code,
      redirect_uri: REDIRECT_URI,
      scope: config.scope,
    })

    this.logger.debug(`Access token has been received: ${JSON.stringify(accessToken)}`)

    return accessToken
  }

  private async endpointHandler(params: {
    resolve: (value: string | PromiseLike<string>) => void
    reject: (reason?: any) => void
    server: http.Server<any, any>
    timeout: NodeJS.Timeout
    res: express.Response
    req: express.Request
    client: AuthorizationCode
  }) {
    const { resolve, reject, server, res, req, timeout, client } = params
    try {
      await this.handleAllow({ resolve, res, req, timeout, client })
      this.handleDecline({ reject, res, req, timeout })
    } catch (e) {
      ux.action.stop('Failed to authenticate')
      this.logger.error((e as Error).toString())
      reject(e)
    } finally {
      this.shutDownServer(server)
    }
  }

  private async handleAllow(params: {
    resolve: (value: string | PromiseLike<string>) => void
    timeout: NodeJS.Timeout
    res: express.Response
    req: express.Request
    client: AuthorizationCode
  }) {
    const { res, req, resolve, timeout, client } = params
    if (req.query.code) {
      const code = String(req.query.code)
      this.logger.debug(
        `Callback request has been received. Code: ${code}\n----------------8<----------------------------\n`,
      )

      clearTimeout(timeout)

      const token = await this.exchangeForToken(client, code)

      tokenService.setUserToken(token.token as UserToken)

      resolve((token.token as UserToken).access_token)
      ux.action.stop('Authenticated successfully!')
      res.end(config.successHTML)
    }
  }

  private handleDecline(params: {
    reject: (reason?: any) => void
    timeout: NodeJS.Timeout
    res: express.Response
    req: express.Request
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
      this.logger.debug(`error: ${error}`)
      this.logger.debug(`error_description: ${errorDescription}`)
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

  public async authenticate(): Promise<string> {
    const isPortInUse = await isOryAuthCallbackPortInUse()

    if (isPortInUse) {
      throw new Error(config.oryAuthCallbackPortUnavailableMessage)
    }

    const client = this.createAuthorizationClient()

    return new Promise<string>((resolve, reject) => {
      this.logger.debug('Start express server')

      const app = express()
      const server = app.listen(config.expressPort, () => {
        this.logger.debug(`Express server started listening on port ${config.expressPort}`)
      })

      const timeout = setTimeout(() => {
        this.shutDownServer(server)
        reject(new Error(`Authentication timeout (${config.redirectTimeoutMs / 1000}s) exceeded`))
      }, config.redirectTimeoutMs)

      app.get(config.redirectPath, async (req, res) => {
        await this.endpointHandler({ req, res, resolve, reject, timeout, server, client })
      })

      const ssoUrl = client.authorizeURL({
        redirect_uri: REDIRECT_URI,
        scope: config.scope,
        state: randomUUID(),
      })

      this.logger.info(config.getSSOMessage(ssoUrl))

      ux.action.start('Authenticating in browser')
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      open(ssoUrl)
    })
  }

  public async logout(): Promise<void> {
    return new Promise<void>((resolve) => {
      resolve()
    })
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
