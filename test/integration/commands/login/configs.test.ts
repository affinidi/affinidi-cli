import { test, expect } from '@oclif/test'
import { data } from './data'

// TODO: Don't show JSON output for commands, it happens because of
//       if (!this.jsonEnabled()) this.logJson(createGroupOutput)

describe('login create-config', () => {
  const validArgs = [
    'login create-config',
    `--name=${data.configName}`,
    '--redirect-uris=https://my-fancy-project.eu.auth0.com/login/callback http://localhost:8080/callback',
  ]
  test
    .stdout()
    .command(validArgs)
    .it('outputs the created config info', async (ctx: any) => {
      const response = await ctx.returned
      data.deleteConfigId = response.id
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

describe('login list-configs', () => {
  const validArgs = ['login list-configs']
  test.command(validArgs).it('outputs the list of created configs', async (ctx: any) => {
    const response = await ctx.returned
    expect(response.configurations[0]).to.have.a.property('ari')
    expect(response.configurations[0]).to.have.a.property('id')
    expect(response.configurations[0]).to.have.a.property('projectId')
    expect(response.configurations[0]).to.have.a.property('name')
    expect(response.configurations[0]).to.have.a.property('redirectUris')
    expect(response.configurations[0]).to.have.a.property('creationDate')
    expect(response.configurations[0]).to.have.a.property('idTokenMapping')
    expect(response.configurations[0]).to.have.a.property('clientMetadata')
  })
})

describe('login get-config', () => {
  const validArgs = ['login get-config', `--id=${data.configId}`]
  test
    .stdout()
    .command(validArgs)
    .it('outputs the created config info', async (ctx: any) => {
      const response = await ctx.returned
      expect(response).to.have.a.property('ari')
      expect(response).to.have.a.property('id')
      expect(response).to.have.a.property('projectId')
      expect(response).to.have.a.property('name')
      expect(response).to.have.a.property('redirectUris')
      expect(response).to.have.a.property('creationDate')
      expect(response).to.have.a.property('idTokenMapping')
      expect(response).to.have.a.property('clientMetadata')
    })
})

describe('login update-config', () => {
  const validArgs = [
    'login update-config',
    `--id=${data.configId}`,
    '--redirect-uris=http://localhost:8080/updated_callback',
  ]

  test
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
      expect(response).to.have.a.property('creationDate')
      expect(response).to.have.a.property('idTokenMapping')
      expect(response).to.have.a.property('clientMetadata')
    })
})
