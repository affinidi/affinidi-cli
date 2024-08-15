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

const configuration = {
  projectId: '940e8684-55b3-4d41-8e3d-cd329e9f22f2',
  name: 'ConfigName',
  description: 'ConfigDescription',
  createdAt: '2024-08-14T06:15:42.015Z',
  modifiedAt: '2024-08-14T06:43:30.450Z',
  createdBy: 'user/1c71597a-372f-4468-a434-7c0e6288ee86',
  modifiedBy: 'user/1c71597a-372f-4468-a434-7c0e6288ee86',
  ari: 'ari:iota_service:ap-southeast-1:940e8684-55b3-4d41-8e3d-cd329e9f22f2:iota_configuration/8740f97f-d5cb-4fdb-af23-4c769cfed3ab',
  walletAri: 'ari:identity:ap-southeast-1:940e8684-55b3-4d41-8e3d-cd329e9f22f2:wallet/886eb843efa8c515c395cc98a5080ff0',
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

describe('iota configs', function () {
  describe('iota:create-config', () => {
    it('creates a configutation and outputs its info', async () => {
      nock(AIS_URL).post('/v1/configurations').reply(200, configuration)
      nock(CWE_URL)
        .get('/v1/wallets')
        .reply(200, { wallets: [didKeyWallet] })
      const { stdout } = await runCommand([
        'iota:create-config',
        `--name=${configuration.name}`,
        `--description=${configuration.description}`,
        `--wallet-ari=${didKeyWallet.ari}`,
        `--response-webhook-url=${configuration.iotaResponseWebhookURL}`,
        `--token-max-age=${configuration.tokenMaxAge}`,
        `--enable-verification`,
        `--enable-consent-audit-log`,
        `--client-name=${configuration.clientMetadata.name}`,
        `--client-logo=${configuration.clientMetadata.logo}`,
        `--client-origin=${configuration.clientMetadata.origin}`,
        '--no-input',
        '--json',
      ])
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

  describe('iota:get-config', () => {
    it('outputs configuration info based on id', async () => {
      nock(AIS_URL).get(`/v1/configurations/${configuration.configurationId}`).reply(200, configuration)
      const { stdout } = await runCommand(['iota:get-config', `--id=${configuration.configurationId}`])
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
          configurations: [configuration],
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
      nock(AIS_URL).patch(`/v1/configurations/${configuration.configurationId}`).reply(200, configuration)

      const { stdout } = await runCommand([
        'iota:update-config',
        `--description=${configuration.description}`,
        `--id=${configuration.configurationId}`,
      ])
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

  describe('iota:delete-config', () => {
    it('deletes configuration', async () => {
      nock(AIS_URL).delete(`/v1/configurations/${configuration.configurationId}`).reply(200)
      const { stdout } = await runCommand(['iota:delete-config', `--id=${configuration.configurationId}`])
      const response = JSON.parse(stdout)
      expect(response).to.have.a.property('id')
    })
  })
})
