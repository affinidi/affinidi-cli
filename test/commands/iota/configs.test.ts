import { CreateIotaConfigurationInputModeEnum } from '@affinidi-tdk/iota-client'
import { runCommand } from '@oclif/test'
import { expect } from 'chai'
import nock from 'nock'

import { config } from '../../../src/services/env-config.js'

const CWE_URL = `${config.bffHost}/cwe`
const AIS_URL = `${config.bffHost}/ais`

const didKeyWallet = {
  did: 'did:key:zQ3shX8xuicHdQjm9PAAvffDJQYHuBBXhsE2f1LWk47JeaSeN',
  id: '886eb843efa8c515c395cc98a5080ff0',
  ari: 'ari:identity:ap-southeast-1:940e8684-55b3-4d41-8e3d-cd329e9f22f2:wallet/886eb843efa8c515c395cc98a5080ff0',
  name: 'Wallet',
  description: '',
  keys: [
    {
      id: 'dde674328e69806278c580f4e09ee41e-236a45f3b9c272c9',
      ari: 'ari:identity:ap-southeast-1:940e8684-55b3-4d41-8e3d-cd329e9f22f2:key/dde674328e69806278c580f4e09ee41e-236a45f3b9c272c9',
    },
  ],
}

const configurationWebsocket = {
  projectId: '940e8684-55b3-4d41-8e3d-cd329e9f22f2',
  name: 'ConfigWebsocket',
  description: 'ConfigDescription',
  ari: 'ari:iota_service:ap-southeast-1:940e8684-55b3-4d41-8e3d-cd329e9f22f2:iota_configuration/8740f97f-d5cb-4fdb-af23-4c769cfed3ab',
  walletAri: 'ari:identity:ap-southeast-1:940e8684-55b3-4d41-8e3d-cd329e9f22f2:wallet/886eb843efa8c515c395cc98a5080ff0',
  mode: CreateIotaConfigurationInputModeEnum.Websocket,
  iotaResponseWebhookURL: 'https://vault.affinidi.com/login',
  enableVerification: true,
  enableConsentAuditLog: true,
  enableIdvProviders: true,
  tokenMaxAge: 10,
  clientMetadata: {
    name: 'testtest',
    logo: 'https://test.com',
    origin: 'https://test.com',
  },
  configurationId: '8740f97f-d5cb-4fdb-af23-4c769cfed3ab',
}

const configurationRedirect = {
  projectId: '940e8684-55b3-4d41-8e3d-cd329e9f22f2',
  name: 'ConfigRedirect',
  description: 'ConfigDescription',
  ari: 'ari:iota_service:ap-southeast-1:940e8684-55b3-4d41-8e3d-cd329e9f22f2:iota_configuration/8740f97f-d5cb-4fdb-af23-4c769cfed3ab',
  walletAri: 'ari:identity:ap-southeast-1:940e8684-55b3-4d41-8e3d-cd329e9f22f2:wallet/886eb843efa8c515c395cc98a5080ff0',
  mode: CreateIotaConfigurationInputModeEnum.Redirect,
  redirectUris: ['http://localhost:3000/iota/redirect'],
  iotaResponseWebhookURL: 'https://vault.affinidi.com/login',
  enableVerification: true,
  enableConsentAuditLog: true,
  tokenMaxAge: 10,
  clientMetadata: {
    name: 'testtest',
    logo: 'https://test.com',
    origin: 'https://test.com',
  },
  configurationId: '8740f97f-d5cb-4fdb-af23-4c769cfed3ab',
}

describe('iota: configs commands', function () {
  describe('iota:create-config', () => {
    it('creates a `websocket` configutation and outputs its info', async () => {
      nock(AIS_URL).post('/v1/configurations').reply(200, configurationWebsocket)
      nock(CWE_URL)
        .get('/v1/wallets')
        .reply(200, { wallets: [didKeyWallet] })
      const { stdout } = await runCommand([
        'iota:create-config',
        `--name="${configurationWebsocket.name}"`,
        `--description="${configurationWebsocket.description}"`,
        `--wallet-ari="${didKeyWallet.ari}"`,
        `--mode="${configurationWebsocket.mode}"`,
        `--response-webhook-url="${configurationWebsocket.iotaResponseWebhookURL}"`,
        `--token-max-age="${configurationWebsocket.tokenMaxAge}"`,
        `--enable-verification`,
        `--enable-consent-audit-log`,
        `--enable-idv-providers`,
        `--client-name="${configurationWebsocket.clientMetadata.name}"`,
        `--client-logo="${configurationWebsocket.clientMetadata.logo}"`,
        `--client-origin="${configurationWebsocket.clientMetadata.origin}"`,
        '--no-input',
        '--json',
      ])
      const response = JSON.parse(stdout)

      expect(response).to.have.a.property('projectId')
      expect(response).to.have.a.property('name')
      expect(response).to.have.a.property('description')
      expect(response).to.have.a.property('ari')
      expect(response).to.have.a.property('mode')
      expect(response).to.have.a.property('walletAri')
      expect(response).to.have.a.property('iotaResponseWebhookURL')
      expect(response).to.have.a.property('enableVerification')
      expect(response).to.have.a.property('enableConsentAuditLog')
      expect(response).to.have.a.property('enableIdvProviders')
      expect(response).to.have.a.property('tokenMaxAge')
      expect(response).to.have.a.property('clientMetadata')
      expect(response).to.have.a.property('configurationId')
    })

    it('creates a `redirect` configutation and outputs its info', async () => {
      nock(AIS_URL).post('/v1/configurations').reply(200, configurationRedirect)
      nock(CWE_URL)
        .get('/v1/wallets')
        .reply(200, { wallets: [didKeyWallet] })
      const { stdout } = await runCommand([
        'iota:create-config',
        `--name="${configurationRedirect.name}"`,
        `--description="${configurationRedirect.description}"`,
        `--wallet-ari="${didKeyWallet.ari}"`,
        `--mode="${configurationRedirect.mode}"`,
        `--redirect-uris="${configurationRedirect.redirectUris.join(' ')}"`,
        `--token-max-age="${configurationRedirect.tokenMaxAge}"`,
        `--enable-verification`,
        `--enable-consent-audit-log`,
        `--client-name="${configurationRedirect.clientMetadata.name}"`,
        `--client-logo="${configurationRedirect.clientMetadata.logo}"`,
        `--client-origin="${configurationRedirect.clientMetadata.origin}"`,
        '--no-input',
        '--json',
      ])
      const response = JSON.parse(stdout)
      expect(response).to.have.a.property('projectId')
      expect(response).to.have.a.property('name')
      expect(response).to.have.a.property('description')
      expect(response).to.have.a.property('ari')
      expect(response).to.have.a.property('mode')
      expect(response).to.have.a.property('redirectUris')
      expect(response).to.have.a.property('walletAri')
      expect(response).to.have.a.property('iotaResponseWebhookURL')
      expect(response).to.have.a.property('enableVerification')
      expect(response).to.have.a.property('enableConsentAuditLog')
      expect(response).to.have.a.property('tokenMaxAge')
      expect(response).to.have.a.property('clientMetadata')
      expect(response).to.have.a.property('configurationId')
    })
  })

  describe('iota:get-config', () => {
    it('outputs configuration info based on id', async () => {
      nock(AIS_URL)
        .get(`/v1/configurations/${configurationWebsocket.configurationId}`)
        .reply(200, configurationWebsocket)
      const { stdout } = await runCommand(['iota:get-config', `--id=${configurationWebsocket.configurationId}`])
      const response = JSON.parse(stdout)
      expect(response).to.have.a.property('projectId')
      expect(response).to.have.a.property('name')
      expect(response).to.have.a.property('description')
      expect(response).to.have.a.property('ari')
      expect(response).to.have.a.property('walletAri')
      expect(response).to.have.a.property('iotaResponseWebhookURL')
      expect(response).to.have.a.property('enableVerification')
      expect(response).to.have.a.property('enableConsentAuditLog')
      expect(response).to.have.a.property('tokenMaxAge')
      expect(response).to.have.a.property('clientMetadata')
      expect(response).to.have.a.property('configurationId')
    })
  })

  describe('iota:list-configs', () => {
    it('outputs the list of configurations', async () => {
      nock(AIS_URL)
        .get('/v1/configurations')
        .reply(200, {
          configurations: [configurationWebsocket],
        })
      const { stdout } = await runCommand(['iota:list-configs'])
      const { configurations: response } = JSON.parse(stdout)
      expect(response[0]).to.have.a.property('projectId')
      expect(response[0]).to.have.a.property('name')
      expect(response[0]).to.have.a.property('description')
      expect(response[0]).to.have.a.property('ari')
      expect(response[0]).to.have.a.property('walletAri')
      expect(response[0]).to.have.a.property('iotaResponseWebhookURL')
      expect(response[0]).to.have.a.property('enableVerification')
      expect(response[0]).to.have.a.property('enableConsentAuditLog')
      expect(response[0]).to.have.a.property('tokenMaxAge')
      expect(response[0]).to.have.a.property('clientMetadata')
      expect(response[0]).to.have.a.property('configurationId')
    })
  })

  describe('iota:update-config', () => {
    it('updates config', async () => {
      nock(AIS_URL)
        .patch(`/v1/configurations/${configurationWebsocket.configurationId}`)
        .reply(200, configurationWebsocket)

      const { stdout } = await runCommand([
        'iota:update-config',
        `--description=${configurationWebsocket.description}`,
        `--id=${configurationWebsocket.configurationId}`,
        '--no-input',
        '--json',
      ])
      const response = JSON.parse(stdout)
      expect(response).to.have.a.property('projectId')
      expect(response).to.have.a.property('name')
      expect(response).to.have.a.property('description')
      expect(response).to.have.a.property('ari')
      expect(response).to.have.a.property('walletAri')
      expect(response).to.have.a.property('mode')
      expect(response).to.have.a.property('iotaResponseWebhookURL')
      expect(response).to.have.a.property('enableVerification')
      expect(response).to.have.a.property('enableConsentAuditLog')
      expect(response).to.have.a.property('tokenMaxAge')
      expect(response).to.have.a.property('clientMetadata')
      expect(response).to.have.a.property('configurationId')
    })

    it('updates config websocket to redirect', async () => {
      nock(AIS_URL)
        .patch(`/v1/configurations/${configurationWebsocket.configurationId}`)
        .reply(200, configurationRedirect)

      const { stdout } = await runCommand([
        'iota:update-config',
        `--id=${configurationWebsocket.configurationId}`,
        `--mode=${CreateIotaConfigurationInputModeEnum.Redirect}`,
        `--redirect-uris="${configurationRedirect.redirectUris[0]}"`,
        '--no-input',
        '--json',
      ])
      const response = JSON.parse(stdout)
      expect(response).to.have.a.property('projectId')
      expect(response).to.have.a.property('name')
      expect(response).to.have.a.property('description')
      expect(response).to.have.a.property('ari')
      expect(response).to.have.a.property('walletAri')
      expect(response).to.have.a.property('mode')
      expect(response).to.have.a.property('redirectUris')
      expect(response).to.have.a.property('iotaResponseWebhookURL')
      expect(response).to.have.a.property('enableVerification')
      expect(response).to.have.a.property('enableConsentAuditLog')
      expect(response).to.have.a.property('tokenMaxAge')
      expect(response).to.have.a.property('clientMetadata')
      expect(response).to.have.a.property('configurationId')
    })
  })

  describe('iota:delete-config', () => {
    it('deletes configuration', async () => {
      nock(AIS_URL).delete(`/v1/configurations/${configurationWebsocket.configurationId}`).reply(200)
      const { stdout } = await runCommand(['iota:delete-config', `--id=${configurationWebsocket.configurationId}`])
      const response = JSON.parse(stdout)
      expect(response).to.have.a.property('id')
    })
  })
})
