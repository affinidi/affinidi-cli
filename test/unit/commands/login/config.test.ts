import { expect, test } from '@oclif/test'
import { VP_ADAPTER_URL } from '../../../../src/services/urls'

const data = {
  newConfigName: 'new-config',
  configId: '1afac523-9ed4-4b72-af29-16c376b5a32a',
}

describe('login: config commands', function () {
  describe('login create-config', () => {
    const validArgs = [
      'login create-config',
      `--name=${data.newConfigName}`,
      '--redirect-uris=http://localhost:8080/callback',
    ]

    test
      .stdout()
      .nock(VP_ADAPTER_URL, (api) =>
        api.post('/v1/login/configurations').reply(200, {
          ari: 'ari:identity:ap-southeast-1:1afac523-9ed4-4b72-af29-16c376b5a32a:login_configuration/20ffcf73875c9fd2bac7f24d385097cc',
          projectId: '1afac523-9ed4-4b72-af29-16c376b5a32a',
          id: '20ffcf73875c9fd2bac7f24d385097cc',
          name: 'test_config',
          auth: {
            clientId: '74708879-6432-4dcf-ac14-27e5d7190005',
            clientSecret: 'miFLARmZdOKzNXAsRJ0Y-nUBVM',
            issuer: 'https://euw1.vpa.auth.affinidi.io',
          },
          redirectUris: ['https://my-fancy-project.eu.auth0.com/login/callback', 'http://localhost:8080/callback'],
          clientMetadata: {
            name: 'test_config',
            logo: 'https://oidc-vp-adapter-frontend.affinidi.com/default-client-logo.svg',
            origin: 'https://my-fancy-project.eu.auth0.com',
          },
          creationDate: '2023-09-22T06:42:17Z',
        }),
      )
      .command(validArgs)
      .it('creates a new login config', async (ctx) => {
        const response = JSON.parse(ctx.stdout)
        expect(response).to.have.a.property('ari')
        expect(response).to.have.a.property('projectId')
        expect(response).to.have.a.property('id')
        expect(response).to.have.a.property('name')
        expect(response).to.have.a.property('auth')
        expect(response).to.have.a.property('redirectUris')
        expect(response).to.have.a.property('clientMetadata')
        expect(response).to.have.a.property('creationDate')
      })
  })

  describe('login get-config', () => {
    const validArgs = ['login get-config', `--id=${data.configId}`]

    test
      .nock(VP_ADAPTER_URL, (api) =>
        api.get(`/v1/login/configurations/${data.configId}`).reply(200, {
          ari: 'ari:identity:ap-southeast-1:1afac523-9ed4-4b72-af29-16c376b5a32a:login_configuration/71bce92020d9b7ec6973ed4971b8a61a',
          id: '71bce92020d9b7ec6973ed4971b8a61a',
          projectId: '1afac523-9ed4-4b72-af29-16c376b5a32a',
          name: 'new-config',
          redirectUris: ['http://localhost:8080/callback'],
          clientId: 'e52f956d-a71b-493f-b7db-f23ecff15c81',
          creationDate: '2023-09-22T06:55:18Z',
          vpDefinition: 'sample_vp_definition',
          clientMetadata: {
            name: 'test_config',
            logo: 'https://oidc-vp-adapter-frontend.affinidi.com/default-client-logo.svg',
            origin: 'https://my-fancy-project.eu.auth0.com',
          },
          idTokenMapping: [
            {
              sourceField: '$.type',
              idTokenClaim: 'type',
            },
            {
              sourceField: '$.credentialSubject.email',
              idTokenClaim: 'email',
            },
          ],
        }),
      )
      .stdout()
      .command(validArgs)
      .it('outputs the config by id', async (ctx) => {
        const response = JSON.parse(ctx.stdout)
        expect(response).to.have.a.property('ari')
        expect(response).to.have.a.property('id')
        expect(response).to.have.a.property('projectId')
        expect(response).to.have.a.property('name')
        expect(response).to.have.a.property('redirectUris')
        expect(response).to.have.a.property('clientId')
        expect(response).to.have.a.property('creationDate')
        expect(response).to.have.a.property('vpDefinition')
        expect(response).to.have.a.property('idTokenMapping')
        expect(response).to.have.a.property('clientMetadata')
      })
  })

  describe('login list-configs', () => {
    const validArgs = ['login list-configs']

    test
      .nock(VP_ADAPTER_URL, (api) =>
        api.get('/v1/login/configurations').reply(200, {
          configurations: [
            {
              ari: 'ari:identity:ap-southeast-1:1afac523-9ed4-4b72-af29-16c376b5a32a:login_configuration/71bce92020d9b7ec6973ed4971b8a61a',
              id: '71bce92020d9b7ec6973ed4971b8a61a',
              projectId: '1afac523-9ed4-4b72-af29-16c376b5a32a',
              name: 'new-config',
              redirectUris: ['http://localhost:8080/callback'],
              clientId: 'e52f956d-a71b-493f-b7db-f23ecff15c81',
              creationDate: '2023-09-22T06:55:18Z',
              vpDefinition: 'sample_vp_definition',
              clientMetadata: {
                name: 'test_config',
                logo: 'https://oidc-vp-adapter-frontend.affinidi.com/default-client-logo.svg',
                origin: 'https://my-fancy-project.eu.auth0.com',
              },
              idTokenMapping: [
                {
                  sourceField: '$.type',
                  idTokenClaim: 'type',
                },
                {
                  sourceField: '$.credentialSubject.email',
                  idTokenClaim: 'email',
                },
              ],
            },
          ],
        }),
      )
      .stdout()
      .command(validArgs)
      .it('outputs the config by id', async (ctx) => {
        const response = JSON.parse(ctx.stdout)
        expect(response.configurations[0]).to.have.a.property('ari')
        expect(response.configurations[0]).to.have.a.property('id')
        expect(response.configurations[0]).to.have.a.property('projectId')
        expect(response.configurations[0]).to.have.a.property('name')
        expect(response.configurations[0]).to.have.a.property('redirectUris')
        expect(response.configurations[0]).to.have.a.property('clientId')
        expect(response.configurations[0]).to.have.a.property('creationDate')
        expect(response.configurations[0]).to.have.a.property('vpDefinition')
        expect(response.configurations[0]).to.have.a.property('idTokenMapping')
        expect(response.configurations[0]).to.have.a.property('clientMetadata')
      })
  })

  describe('login update-config', () => {
    const validArgs = [
      'login update-config',
      `--id=${data.configId}`,
      '--redirect-uris=http://localhost:8080/updated_callback',
    ]

    test
      .nock(VP_ADAPTER_URL, (api) =>
        api.patch(`/v1/login/configurations/${data.configId}`).reply(200, {
          ari: 'ari:identity:ap-southeast-1:1afac523-9ed4-4b72-af29-16c376b5a32a:login_configuration/71bce92020d9b7ec6973ed4971b8a61a',
          id: '71bce92020d9b7ec6973ed4971b8a61a',
          projectId: '1afac523-9ed4-4b72-af29-16c376b5a32a',
          name: 'new-config',
          redirectUris: ['http://localhost:8080/updated_callback'],
          clientId: 'e52f956d-a71b-493f-b7db-f23ecff15c81',
          creationDate: '2023-09-22T06:55:18Z',
          vpDefinition: 'sample_vp_definition',
          clientMetadata: {
            name: 'test_config',
            logo: 'https://oidc-vp-adapter-frontend.affinidi.com/default-client-logo.svg',
            origin: 'https://my-fancy-project.eu.auth0.com',
          },
          idTokenMapping: [
            {
              sourceField: '$.type',
              idTokenClaim: 'type',
            },
            {
              sourceField: '$.credentialSubject.email',
              idTokenClaim: 'email',
            },
          ],
        }),
      )
      .stdout()
      .command(validArgs)
      .it('updates the config by id', async (ctx) => {
        const response = JSON.parse(ctx.stdout)
        expect(response).to.have.a.property('ari')
        expect(response).to.have.a.property('id')
        expect(response).to.have.a.property('projectId')
        expect(response).to.have.a.property('name')
        expect(response).to.have.a.property('redirectUris')
        expect(response.redirectUris[0]).equals('http://localhost:8080/updated_callback')
        expect(response).to.have.a.property('clientId')
        expect(response).to.have.a.property('creationDate')
        expect(response).to.have.a.property('vpDefinition')
        expect(response).to.have.a.property('idTokenMapping')
        expect(response).to.have.a.property('clientMetadata')
      })
  })

  describe('login delete-config', () => {
    const validArgs = ['login delete-config', `--id=${data.configId}`]

    test
      .nock(VP_ADAPTER_URL, (api) => api.delete(`/v1/login/configurations/${data.configId}`).reply(200))
      .stdout()
      .command(validArgs)
      .it('deletes the config by id', async (ctx) => {
        const response = JSON.parse(ctx.stdout)
        expect(response).to.have.a.property('id')
      })
  })
})
