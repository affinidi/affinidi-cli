import { expect, test } from '@oclif/test'
import { config } from '../../../src/services/env-config'

const IAM_URL = `${config.bffHost}/iam`

const data = {
  newTokenName: 'new-token-name',
  keyId: '12345',
  publicKeyFilePath: 'test/helpers/public_key.pem',
  tokenId: 'c4a32776-3203-4bf7-87d9-a6e6f9ddd09e',
}

describe('login: token management commands', function () {
  describe('token:create-token', () => {
    const validArgs = [
      'token:create-token',
      `--name=${data.newTokenName}`,
      `--key-id=${data.keyId}`,
      `--public-key-file=${data.publicKeyFilePath}`,
    ]

    test
      .nock(IAM_URL, (api) =>
        api.post('/v1/tokens').reply(200, {
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
        }),
      )
      .stdout()
      .command(validArgs)
      .it('creates a token and outputs its info', async (ctx) => {
        const response = JSON.parse(ctx.stdout)
        expect(response).to.have.a.property('id')
        expect(response).to.have.a.property('ari')
        expect(response).to.have.a.property('ownerAri')
        expect(response).to.have.a.property('name')
        expect(response).to.have.a.property('scopes')
        expect(response).to.have.a.property('authenticationMethod')
      })
  })

  describe('token:get-token', () => {
    const validArgs = ['token:get-token', `--token-id=${data.tokenId}`]

    test
      .nock(IAM_URL, (api) =>
        api.get(`/v1/tokens/${data.tokenId}`).reply(200, {
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
        }),
      )
      .stdout()
      .command(validArgs)
      .it('outputs the token info based on id', async (ctx) => {
        const response = JSON.parse(ctx.stdout)
        expect(response).to.have.a.property('id')
        expect(response).to.have.a.property('ari')
        expect(response).to.have.a.property('ownerAri')
        expect(response).to.have.a.property('name')
        expect(response).to.have.a.property('scopes')
        expect(response).to.have.a.property('authenticationMethod')
      })
  })

  describe('token:list-tokens', () => {
    const validArgs = ['token:list-tokens']

    test
      .nock(IAM_URL, (api) =>
        api.get('/v1/tokens').reply(200, {
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
        }),
      )
      .stdout()
      .command(validArgs)
      .it('outputs the list of tokens', async (ctx) => {
        const response = JSON.parse(ctx.stdout)
        expect(response[0]).to.have.a.property('id')
        expect(response[0]).to.have.a.property('ari')
        expect(response[0]).to.have.a.property('ownerAri')
        expect(response[0]).to.have.a.property('name')
        expect(response[0]).to.have.a.property('scopes')
        expect(response[0]).to.have.a.property('authenticationMethod')
      })
  })

  describe('token:update-token', () => {
    const validArgs = [
      'token:update-token',
      `--name=${data.newTokenName}`,
      `--key-id=${data.keyId}`,
      `--public-key-file=${data.publicKeyFilePath}`,
      `--token-id=${data.tokenId}`,
    ]

    test
      .nock(IAM_URL, (api) =>
        api.patch(`/v1/tokens/${data.tokenId}`).reply(200, {
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
        }),
      )
      .stdout()
      .command(validArgs)
      .it('update the token info based on id', async (ctx) => {
        const response = JSON.parse(ctx.stdout)
        expect(response).to.have.a.property('id')
        expect(response).to.have.a.property('ari')
        expect(response).to.have.a.property('ownerAri')
        expect(response).to.have.a.property('name')
        expect(response).to.have.a.property('scopes')
        expect(response).to.have.a.property('authenticationMethod')
      })
  })

  describe('token:delete-token', () => {
    const validArgs = ['token:delete-token', `--token-id=${data.tokenId}`]

    test
      .nock(IAM_URL, (api) => api.delete(`/v1/tokens/${data.tokenId}`).reply(200))
      .stdout()
      .command(validArgs)
      .it('update the token info based on id', async (ctx) => {
        const response = JSON.parse(ctx.stdout)
        expect(response).to.have.a.property('id')
      })
  })
})
