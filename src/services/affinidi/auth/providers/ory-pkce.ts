import crypto from 'crypto'
import http from 'http'
import { ux } from '@oclif/core'
import axios from 'axios'
import express from 'express'
import open from 'open'
import { config, isOryAuthCallbackPortInUse } from './config'
import { AuthProvider, AuthProviderConfig } from './types'
import { LoggerAdapter } from '../../adapters'
import { tokenService, UserToken } from '../token'

const CHARACTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

type TokenExchangeInput = {
  code: string
  pkce: { verifier: string }
}

type Request = { state: string; pkce: { verifier: string } }

type PConfig = {
  server: {
    authUrl: string
    tokenUrl: string
  }
  client: {
    clientId: string
  }
  redirectUri: string
}

type PKCE = {
  challenge: string
  verifier: string
}

export class OryAuthenticatorPKCE implements AuthProvider {
  private readonly clientId: string

  private readonly host: string

  private readonly logger: LoggerAdapter

  private readonly pConfig: PConfig

  private request!: Request

  constructor({ clientId, host, logger }: AuthProviderConfig) {
    this.clientId = clientId
    this.host = host
    this.logger = logger

    this.pConfig = {
      server: {
        authUrl: `${this.host}/oauth2/auth`,
        tokenUrl: `${this.host}/oauth2/token`,
      },
      client: {
        clientId,
      },
      redirectUri: `${config.redirectHost}:${config.expressPort}${config.redirectPath}`,
    }
  }

  private async exchangeForToken({ code, pkce: { verifier } }: TokenExchangeInput): Promise<UserToken> {
    const form = new FormData()
    form.append('grant_type', 'authorization_code')
    form.append('client_id', this.pConfig.client.clientId)
    form.append('redirect_uri', this.pConfig.redirectUri)
    form.append('code_verifier', verifier)
    form.append('code', code)

    const { data } = await axios.post<UserToken>(this.pConfig.server.tokenUrl, form)
    this.logger.debug(`User token has been received: ${JSON.stringify(data)}`)

    return data
  }

  /**
   * Handles callback endpoint call.
   * Covers 2 use cases:
   *  - user `Allow` request to access the personal data
   *  - user `Decline` request to access the personal data
   * @param params
   * @private
   */
  private async endpointHandler(params: {
    resolve: (value: string | PromiseLike<string>) => void
    reject: (reason?: any) => void
    server: http.Server<any, any>
    timeout: NodeJS.Timeout
    res: express.Response
    req: express.Request
  }) {
    const { resolve, reject, server, res, req, timeout } = params
    try {
      await this.handleAllow({ resolve, res, req, timeout })
      this.handleDecline({ reject, res, req, timeout })
    } catch (e) {
      ux.action.stop('Failed to authenticate')
      this.logger.error((e as Error).toString())
      reject(e)
    } finally {
      this.shutDownServer(server)
    }
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
    timeout: NodeJS.Timeout
    res: express.Response
    req: express.Request
  }) {
    const { res, req, resolve, timeout } = params
    if (req.query.code) {
      const code = String(req.query.code)
      this.logger.debug(
        `Callback request has been received. Code: ${code}\n----------------8<----------------------------\n`,
      )

      clearTimeout(timeout)

      const token = await this.exchangeForToken({
        code,
        pkce: this.request.pkce,
      })
      tokenService.setUserToken(token)
      ux.action.stop('Authenticated successfully!')
      resolve(token.access_token)
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

  private async generateAuthRequest(scope: string): Promise<{
    ssoUrl: string
    request: Request
  }> {
    const pkce = await OryAuthenticatorPKCE.createPKCE()
    const state = OryAuthenticatorPKCE.createState()
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: this.pConfig.client.clientId,
      redirect_uri: this.pConfig.redirectUri,
      code_challenge: pkce.challenge,
      code_challenge_method: config.codeChallengeMethod,
      scope,
      state,
    })

    return {
      ssoUrl: `${this.pConfig.server.authUrl}?${params.toString()}`,
      request: { state, pkce: { verifier: pkce.verifier } },
    }
  }

  public async authenticate(): Promise<string> {
    const isPortInUse = await isOryAuthCallbackPortInUse()

    if (isPortInUse) {
      throw new Error(config.oryAuthCallbackPortUnavailableMessage)
    }

    const { ssoUrl, request } = await this.generateAuthRequest(config.scope)

    this.request = request

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
        await this.endpointHandler({ req, res, resolve, reject, timeout, server })
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

  private static generateRandomString(length: number): string {
    return Array(length)
      .fill(null)
      .map(() => CHARACTERS.charAt(Math.floor(Math.random() * CHARACTERS.length)))
      .join('')
  }

  private static createPKCE(): PKCE {
    const verifier = this.generateRandomString(config.PKCEBytes)
    const challenge = this.safeBase64UrlEncode(this.sha256(verifier))
    return { verifier, challenge }
  }

  private static createState(): string {
    return this.generateRandomString(config.stateBytes)
  }

  private static sha256(str: string): Uint8Array {
    return crypto.createHash('sha256').update(str).digest()
  }

  private static safeBase64UrlEncode(input: Uint8Array): string {
    let byteString = ''
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < input.byteLength; i++) {
      byteString += String.fromCharCode(input[i])
    }

    return btoa(byteString).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
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
