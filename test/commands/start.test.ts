import { runCommand } from '@oclif/test'
import { expect } from 'chai'
import nock from 'nock'
import { config } from '../../src/services/env-config.js'

describe('start', () => {
  let authUrlRequests: Record<string, unknown>[]

  beforeEach(() => {
    authUrlRequests = []
    // Failing the auth url request stops the login before a browser or callback server is started.
    nock(config.bffHost)
      .post('/api/auth/url', (body) => authUrlRequests.push(body) > 0)
      .reply(400, { message: 'stop' })
  })

  afterEach(() => nock.cleanAll())

  it('logs in with the provider given by --provider', async () => {
    await runCommand(['start', '--provider', 'github'])

    expect(authUrlRequests).to.have.length(1)
    expect(authUrlRequests[0].provider).to.equal('github')
  })

  it('defaults to Affinidi Vault by omitting the provider with --no-input', async () => {
    await runCommand(['start', '--no-input'])

    expect(authUrlRequests).to.have.length(1)
    expect(authUrlRequests[0]).not.to.have.property('provider')
  })

  it('logs in with email one-time code without sending a provider', async () => {
    await runCommand(['start', '--provider', 'email'])

    expect(authUrlRequests).to.have.length(1)
    expect(authUrlRequests[0]).not.to.have.property('provider')
  })

  it('rejects an unsupported provider', async () => {
    const { error } = await runCommand(['start', '--provider', 'facebook'])

    expect(error?.message).to.contain('Expected --provider=facebook to be one of')
    expect(authUrlRequests).to.be.empty
  })
})
