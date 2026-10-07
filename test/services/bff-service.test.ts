import { expect } from 'chai'
import nock from 'nock'
import { LoginProviders } from '../../src/common/constants.js'
import { bffService } from '../../src/services/affinidi/bff-service.js'
import { config } from '../../src/services/env-config.js'

const AUTH_URL = 'https://auth.example.com/oauth2/auth?state=abc'

describe('bffService', () => {
  afterEach(() => nock.cleanAll())

  describe('postAuthUrl', () => {
    it('sends the selected login provider to the BFF', async () => {
      nock(config.bffHost)
        .post('/api/auth/url', { publicKey: 'pem', uxClient: config.bffUxClient, provider: 'github' })
        .reply(200, { authUrl: AUTH_URL })

      const url = await bffService.postAuthUrl('pem', LoginProviders.GITHUB)

      expect(url.href).to.equal(AUTH_URL)
    })

    it('omits the provider when none is selected', async () => {
      nock(config.bffHost)
        .post('/api/auth/url', (body) => body.publicKey === 'pem' && !('provider' in body))
        .reply(200, { authUrl: AUTH_URL })

      const url = await bffService.postAuthUrl('pem')

      expect(url.href).to.equal(AUTH_URL)
    })
  })
})
