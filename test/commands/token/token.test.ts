import { runCommand } from '@oclif/test'
import { config } from '../../../src/services/env-config.js'
import nock from 'nock'
import { expect } from 'chai'

const IAM_URL = `${config.bffHost}/iam`

const data = {
  newTokenName: 'new-token-name',
  keyId: '12345',
  publicKeyFilePath: 'test/helpers/public_key.pem',
  tokenId: 'c4a32776-3203-4bf7-87d9-a6e6f9ddd09e',
  passphrase: 'top-secret',
}

describe('login: token management commands', function () {
  describe('token:create-token', () => {
    it('creates a token and outputs its info', async () => {
      nock(IAM_URL)
        .post('/v1/tokens')
        .reply(200, {
          id: '1234',
          ari: 'ari:iam:::user/2f4b3468-516f-4af3-87db-8816b0d320cc',
          ownerAri: 'AIV/Concierge API - affinidi-elements-iam-dev',
          name: 'test',
          authenticationMethod: {
            type: 'PRIVATE_KEY',
            signingAlgorithm: 'RS256',
            publicKeyInfo: {
              jwks: {
                keys: [
                  {
                    use: 'sig',
                    kty: 'RSA',
                    kid: '12345',
                    alg: 'RS256',
                    n: '3CNY1aZmssMdh2dGKJpGki_BD5URuW8ngNMkZhJ1ux9X6vjng3XMLnvY2yTm3ucnEfl_XDLXE6K0wIt_1z2aGf-Kq1okCivnKv6DS1afX8J-ewvS-TnKTNFrtX9fRHxdBp2Pah144niZxScJKWhBQDjtrNJOEk-JpEkp-6MzvEQ-pac2_7ZyEAnWncQ8ncR_liYgxGj5ZQ6q2md-Gkk6dxmAe3W2oQPNOMqOtVUkQ1u79e8pmdgVEnuTJ2vdoyWaXmQBHsSISEHozaxjgf5wKiGy0K1aT30pfxzGy9xGdNAVj7g9lUoPRqfk-Sz4Uyy4osCn8jVqkrAmypTPVb_PFQ',
                    e: 'AQAB',
                  },
                ],
              },
            },
          },
          scopes: ['test'],
        })
      const { stdout } = await runCommand([
        'token:create-token',
        `--name=${data.newTokenName}`,
        `--key-id=${data.keyId}`,
        `--public-key-file=${data.publicKeyFilePath}`,
        '--no-input',
        '--json',
      ])
      const response = JSON.parse(stdout)
      expect(response).to.have.a.property('id')
      expect(response).to.have.a.property('ari')
      expect(response).to.have.a.property('ownerAri')
      expect(response).to.have.a.property('name')
      expect(response).to.have.a.property('scopes')
      expect(response).to.have.a.property('authenticationMethod')
    })
  })

  describe('token:create-token with-permissions auto-generate-key', () => {
    it('generates private public key pair used for token creation, updates policies, returns PAT variables for TDK', async () => {
      nock(IAM_URL)
        .post('/v1/tokens')
        .reply(200, {
          id: data.tokenId,
          ari: 'ari:iam:::user/2f4b3468-516f-4af3-87db-8816b0d320cc',
          ownerAri: 'AIV/Concierge API - affinidi-elements-iam-dev',
          name: 'test',
          authenticationMethod: {
            type: 'PRIVATE_KEY',
            signingAlgorithm: 'RS256',
            publicKeyInfo: {
              jwks: {
                keys: [
                  {
                    use: 'sig',
                    kty: 'RSA',
                    kid: data.tokenId,
                    alg: 'RS256',
                    n: '3CNY1aZmssMdh2dGKJpGki_BD5URuW8ngNMkZhJ1ux9X6vjng3XMLnvY2yTm3ucnEfl_XDLXE6K0wIt_1z2aGf-Kq1okCivnKv6DS1afX8J-ewvS-TnKTNFrtX9fRHxdBp2Pah144niZxScJKWhBQDjtrNJOEk-JpEkp-6MzvEQ-pac2_7ZyEAnWncQ8ncR_liYgxGj5ZQ6q2md-Gkk6dxmAe3W2oQPNOMqOtVUkQ1u79e8pmdgVEnuTJ2vdoyWaXmQBHsSISEHozaxjgf5wKiGy0K1aT30pfxzGy9xGdNAVj7g9lUoPRqfk-Sz4Uyy4osCn8jVqkrAmypTPVb_PFQ',
                    e: 'AQAB',
                  },
                ],
              },
            },
          },
          scopes: ['test'],
        })
      nock(IAM_URL).post('/v1/projects/principals').reply(200)
      nock(IAM_URL).put(`/v1/policies/principals/${data.tokenId}?principalType=token`).reply(200)
      nock(config.bffHost).get('/api/project').reply(200, { id: '1234' })
      const { stdout } = await runCommand([
        'token:create-token',
        `--name=${data.newTokenName}`,
        `--public-key-file=${data.publicKeyFilePath}`,
        `--key-id=${data.keyId}`,
        `--with-permissions`,
        '--no-input',
        `--json`,
      ])
      const response = JSON.parse(stdout)
      expect(response).to.have.a.property('id')
      expect(response).to.have.a.property('ari')
      expect(response).to.have.a.property('ownerAri')
      expect(response).to.have.a.property('name')
      expect(response).to.have.a.property('scopes')
      expect(response).to.have.a.property('authenticationMethod')
    })
  })

  describe('token:get-token', () => {
    it('outputs the token info based on id', async () => {
      nock(IAM_URL)
        .get(`/v1/tokens/${data.tokenId}`)
        .reply(200, {
          id: '1234',
          ari: 'ari:iam:::user/2f4b3468-516f-4af3-87db-8816b0d320cc',
          ownerAri: 'AIV/Concierge API - affinidi-elements-iam-dev',
          name: 'test',
          authenticationMethod: {
            type: 'PRIVATE_KEY',
            signingAlgorithm: 'RS256',
            publicKeyInfo: {
              jwks: {
                keys: [
                  {
                    use: 'sig',
                    kty: 'RSA',
                    kid: '12345',
                    alg: 'RS256',
                    n: '3CNY1aZmssMdh2dGKJpGki_BD5URuW8ngNMkZhJ1ux9X6vjng3XMLnvY2yTm3ucnEfl_XDLXE6K0wIt_1z2aGf-Kq1okCivnKv6DS1afX8J-ewvS-TnKTNFrtX9fRHxdBp2Pah144niZxScJKWhBQDjtrNJOEk-JpEkp-6MzvEQ-pac2_7ZyEAnWncQ8ncR_liYgxGj5ZQ6q2md-Gkk6dxmAe3W2oQPNOMqOtVUkQ1u79e8pmdgVEnuTJ2vdoyWaXmQBHsSISEHozaxjgf5wKiGy0K1aT30pfxzGy9xGdNAVj7g9lUoPRqfk-Sz4Uyy4osCn8jVqkrAmypTPVb_PFQ',
                    e: 'AQAB',
                  },
                ],
              },
            },
          },
          scopes: ['test'],
        })
      const { stdout } = await runCommand(['token:get-token', `--token-id=${data.tokenId}`])
      const response = JSON.parse(stdout)
      expect(response).to.have.a.property('id')
      expect(response).to.have.a.property('ari')
      expect(response).to.have.a.property('ownerAri')
      expect(response).to.have.a.property('name')
      expect(response).to.have.a.property('scopes')
      expect(response).to.have.a.property('authenticationMethod')
    })
  })

  describe('token:list-tokens', () => {
    it('outputs the list of tokens', async () => {
      nock(IAM_URL)
        .get('/v1/tokens')
        .reply(200, {
          tokens: [
            {
              id: '1234',
              ari: 'ari:iam:::user/2f4b3468-516f-4af3-87db-8816b0d320cc',
              ownerAri: 'AIV/Concierge API - affinidi-elements-iam-dev',
              name: 'test',
              authenticationMethod: {
                type: 'PRIVATE_KEY',
                signingAlgorithm: 'RS256',
                publicKeyInfo: {
                  jwks: {
                    keys: [
                      {
                        use: 'sig',
                        kty: 'RSA',
                        kid: '12345',
                        alg: 'RS256',
                        n: '3CNY1aZmssMdh2dGKJpGki_BD5URuW8ngNMkZhJ1ux9X6vjng3XMLnvY2yTm3ucnEfl_XDLXE6K0wIt_1z2aGf-Kq1okCivnKv6DS1afX8J-ewvS-TnKTNFrtX9fRHxdBp2Pah144niZxScJKWhBQDjtrNJOEk-JpEkp-6MzvEQ-pac2_7ZyEAnWncQ8ncR_liYgxGj5ZQ6q2md-Gkk6dxmAe3W2oQPNOMqOtVUkQ1u79e8pmdgVEnuTJ2vdoyWaXmQBHsSISEHozaxjgf5wKiGy0K1aT30pfxzGy9xGdNAVj7g9lUoPRqfk-Sz4Uyy4osCn8jVqkrAmypTPVb_PFQ',
                        e: 'AQAB',
                      },
                    ],
                  },
                },
              },
              scopes: ['test'],
            },
          ],
        })
      const { stdout } = await runCommand(['token:list-tokens'])
      const response = JSON.parse(stdout)
      expect(response[0]).to.have.a.property('id')
      expect(response[0]).to.have.a.property('ari')
      expect(response[0]).to.have.a.property('ownerAri')
      expect(response[0]).to.have.a.property('name')
      expect(response[0]).to.have.a.property('scopes')
      expect(response[0]).to.have.a.property('authenticationMethod')
    })
  })

  describe('token:update-token', () => {
    it('update the token info based on id', async () => {
      nock(IAM_URL)
        .patch(`/v1/tokens/${data.tokenId}`)
        .reply(200, {
          id: '1234',
          ari: 'ari:iam:::user/2f4b3468-516f-4af3-87db-8816b0d320cc',
          ownerAri: 'AIV/Concierge API - affinidi-elements-iam-dev',
          name: 'test',
          authenticationMethod: {
            type: 'PRIVATE_KEY',
            signingAlgorithm: 'RS256',
            publicKeyInfo: {
              jwks: {
                keys: [
                  {
                    use: 'sig',
                    kty: 'RSA',
                    kid: '12345',
                    alg: 'RS256',
                    n: '3CNY1aZmssMdh2dGKJpGki_BD5URuW8ngNMkZhJ1ux9X6vjng3XMLnvY2yTm3ucnEfl_XDLXE6K0wIt_1z2aGf-Kq1okCivnKv6DS1afX8J-ewvS-TnKTNFrtX9fRHxdBp2Pah144niZxScJKWhBQDjtrNJOEk-JpEkp-6MzvEQ-pac2_7ZyEAnWncQ8ncR_liYgxGj5ZQ6q2md-Gkk6dxmAe3W2oQPNOMqOtVUkQ1u79e8pmdgVEnuTJ2vdoyWaXmQBHsSISEHozaxjgf5wKiGy0K1aT30pfxzGy9xGdNAVj7g9lUoPRqfk-Sz4Uyy4osCn8jVqkrAmypTPVb_PFQ',
                    e: 'AQAB',
                  },
                ],
              },
            },
          },
          scopes: ['test'],
        })

      const { stdout } = await runCommand([
        'token:update-token',
        `--name=${data.newTokenName}`,
        `--key-id=${data.keyId}`,
        `--public-key-file=${data.publicKeyFilePath}`,
        `--token-id=${data.tokenId}`,
      ])
      const response = JSON.parse(stdout)
      expect(response).to.have.a.property('id')
      expect(response).to.have.a.property('ari')
      expect(response).to.have.a.property('ownerAri')
      expect(response).to.have.a.property('name')
      expect(response).to.have.a.property('scopes')
      expect(response).to.have.a.property('authenticationMethod')
    })
  })

  describe('token:delete-token', () => {
    it('update the token info based on id', async () => {
      nock(IAM_URL).delete(`/v1/tokens/${data.tokenId}`).reply(200)
      const { stdout } = await runCommand(['token:delete-token', `--token-id=${data.tokenId}`])
      const response = JSON.parse(stdout)
      expect(response).to.have.a.property('id')
    })
  })
})
