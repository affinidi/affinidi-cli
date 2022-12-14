import { Command } from '@oclif/core'
import express from 'express'
import open from '@oclif/core/lib/cli-ux/open'
import { newVaultService } from '../../services/oAuthVault'

const { AuthorizationCode } = require('simple-oauth2')
const { randomUUID } = require('crypto')

export default class Login extends Command {
  static description = 'describe the command here'

  static examples = ['<%= config.bin %> <%= command.id %>']

  static args = [{ name: 'file' }]

  public async run(): Promise<void> {
    const REDIRECT_URI = 'http://127.0.0.1:2777/callback'
    const SCOPE = 'openid offline offline_access'
    const app = express()

    const client = new AuthorizationCode({
      client: {
        id: '0c1a7e45-c31a-422f-9c7d-b6719e31d5a1',
        secret: 'wqkhV5binEODuQ4cNin4hgEXn',
      },
      auth: {
        tokenHost: 'https://boring-galileo-bjhg4t85fi.projects.oryapis.com',
        authorizePath: '/oauth2/auth',
        tokenPath: '/oauth2/token',
      },
    })

    const askForURL = async (): Promise<string> => {
      const uri = client.authorizeURL({
        redirect_uri: REDIRECT_URI,
        scope: SCOPE,
        state: randomUUID(),
      })
      return uri
    }
    const exchangeForToken = async ({ code }: { code: string }) => {
      const accessToken = await client.getToken({ code, redirect_uri: REDIRECT_URI, scope: SCOPE })

      return accessToken
    }
    const server = await app.listen(2777)

    let code: string
    app.get('/callback', async function (req, res) {
      code = String(req.query.code)
      newVaultService.clear()
      newVaultService.setUserToken(await exchangeForToken({ code }))
      res.end('')
      server.close()
    })

    open(await askForURL())
  }
}
