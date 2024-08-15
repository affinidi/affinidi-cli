import { runCommand } from '@oclif/test'
import { expect } from 'chai'
import nock from 'nock'

import { DidMethods } from '../../../src/common/constants.js'
import { config } from '../../../src/services/env-config.js'

const CWE_URL = `${config.bffHost}/cwe`

const didKeyWallet = {
  did: 'did:key:zQ3shX8xuicHdQjm9PAAvffDJQYHuBBXhsE2f1LWk47JeaSeN',
  id: '886eb843efa8c515c395cc98a5080ff0',
  ari: 'ari:identity:ap-southeast-1:940e8684-55b3-4d41-8e3d-cd329e9f22f2:wallet/886eb843efa8c515c395cc98a5080ff0',
  name: 'Test',
  description: '',
  keys: [
    {
      id: 'dde674328e69806278c580f4e09ee41e-236a45f3b9c272c9',
      ari: 'ari:identity:ap-southeast-1:940e8684-55b3-4d41-8e3d-cd329e9f22f2:key/dde674328e69806278c580f4e09ee41e-236a45f3b9c272c9',
    },
  ],
}

const didKeyWalletUpdated = {
  did: 'did:key:zQ3shX8xuicHdQjm9PAAvffDJQYHuBBXhsE2f1LWk47JeaSeN',
  id: '886eb843efa8c515c395cc98a5080ff0',
  ari: 'ari:identity:ap-southeast-1:940e8684-55b3-4d41-8e3d-cd329e9f22f2:wallet/886eb843efa8c515c395cc98a5080ff0',
  name: 'NewName',
  description: 'NewDescription',
  keys: [
    {
      id: 'dde674328e69806278c580f4e09ee41e-236a45f3b9c272c9',
      ari: 'ari:identity:ap-southeast-1:940e8684-55b3-4d41-8e3d-cd329e9f22f2:key/dde674328e69806278c580f4e09ee41e-236a45f3b9c272c9',
    },
  ],
}

const didWebUrl = 'test.com'

const didWebWallet = {
  did: 'did:web:test.com',
  id: '858ed4fa49002b6e22310bd510f50f01',
  didDocument: {
    id: 'did:web:test.com',
    '@context': 'https://w3id.org/security/v2',
    publicKey: [
      {
        id: 'did:web:test.com#primary',
        usage: 'signing',
        type: 'Secp256k1VerificationKey2018',
        publicKeyHex: '0367b0e688887bc1d7b3341dfa56a549104957259a75b3ca1881afbca6e69da82e',
      },
    ],
    authentication: ['did:web:test.com#primary'],
    assertionMethod: ['did:web:test.com#primary'],
  },
  ari: 'ari:identity:ap-southeast-1:940e8684-55b3-4d41-8e3d-cd329e9f22f2:wallet/858ed4fa49002b6e22310bd510f50f01',
  name: '123',
  description: '',
  keys: [
    {
      id: 'e55bd987ad87eda34425759627652713-2533c445b7dc9fde',
      ari: 'ari:identity:ap-southeast-1:940e8684-55b3-4d41-8e3d-cd329e9f22f2:key/e55bd987ad87eda34425759627652713-2533c445b7dc9fde',
    },
  ],
}

describe('wallet', function () {
  describe('wallet:create-wallet', () => {
    it('creates a wallet with did:key and outputs its info', async () => {
      nock(CWE_URL).post('/v1/wallets').reply(200, didKeyWallet)
      const { stdout } = await runCommand([
        'wallet:create-wallet',
        `--name=${didKeyWallet.name}`,
        `--did-method=${DidMethods.KEY}`,
        '--no-input',
        '--json',
      ])
      const response = JSON.parse(stdout)
      expect(response).to.have.a.property('did')
      expect(response).to.have.a.property('id')
      expect(response).to.have.a.property('ari')
      expect(response).to.have.a.property('name')
      expect(response).to.have.a.property('description')
      expect(response).to.have.a.property('keys')
    })

    it('creates a wallet with did:web and outputs its info', async () => {
      nock(CWE_URL).post('/v1/wallets').reply(200, didKeyWallet)
      const { stdout } = await runCommand([
        'wallet:create-wallet',
        `--name=${didKeyWallet.name}`,
        `--did-method=${DidMethods.WEB}`,
        `--did-web-url=${didWebUrl}`,
        '--no-input',
        '--json',
      ])
      const response = JSON.parse(stdout)
      expect(response).to.have.a.property('did')
      expect(response).to.have.a.property('id')
      expect(response).to.have.a.property('ari')
      expect(response).to.have.a.property('name')
      expect(response).to.have.a.property('description')
      expect(response).to.have.a.property('keys')
    })
  })

  describe('wallet:get-wallet', () => {
    it('outputs the token info based on id', async () => {
      nock(CWE_URL).get(`/v1/wallets/${didKeyWallet.id}`).reply(200, didKeyWallet)
      const { stdout } = await runCommand(['wallet:get-wallet', `--id=${didKeyWallet.id}`])
      const response = JSON.parse(stdout)
      expect(response).to.have.a.property('did')
      expect(response).to.have.a.property('id')
      expect(response).to.have.a.property('ari')
      expect(response).to.have.a.property('name')
      expect(response).to.have.a.property('description')
      expect(response).to.have.a.property('keys')
    })
  })

  describe('wallet:list-wallets', () => {
    it('outputs the list of wallets', async () => {
      nock(CWE_URL)
        .get('/v1/wallets')
        .reply(200, {
          wallets: [didKeyWallet, didWebWallet],
        })
      const { stdout } = await runCommand(['wallet:list-wallets'])
      const { wallets: response } = JSON.parse(stdout)
      expect(response[0]).to.have.a.property('did')
      expect(response[0]).to.have.a.property('id')
      expect(response[0]).to.have.a.property('ari')
      expect(response[0]).to.have.a.property('name')
      expect(response[0]).to.have.a.property('description')
      expect(response[0]).to.have.a.property('keys')
    })
  })

  describe('wallet:update-wallet', () => {
    it('updates the wallet', async () => {
      nock(CWE_URL).patch(`/v1/wallets/${didKeyWallet.id}`).reply(200, didKeyWalletUpdated)

      const { stdout } = await runCommand([
        'wallet:update-wallet',
        `--description=${didKeyWalletUpdated.description}`,
        `--id=${didKeyWallet.id}`,
      ])
      const response = JSON.parse(stdout)
      expect(response).to.have.a.property('did')
      expect(response).to.have.a.property('id')
      expect(response).to.have.a.property('ari')
      expect(response).to.have.a.property('name')
      expect(response).to.have.a.property('description')
      expect(response).to.have.a.property('keys')
    })
  })

  describe('wallet:delete-wallet', () => {
    it('deletes the wallet', async () => {
      nock(CWE_URL).delete(`/v1/wallets/${didKeyWallet.id}`).reply(200)
      const { stdout } = await runCommand(['wallet:delete-wallet', `--id=${didKeyWallet.id}`])
      const response = JSON.parse(stdout)
      expect(response).to.have.a.property('id')
    })
  })
})
