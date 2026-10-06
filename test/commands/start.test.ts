import { AddressInfo, createServer } from 'net'
import { captureOutput } from '@oclif/test'
import { expect } from 'chai'
import nock from 'nock'
import { Start } from '../../src/commands/start.js'
import { config } from '../../src/services/env-config.js'

const getFreePort = () =>
  new Promise<number>((resolve, reject) => {
    const server = createServer().listen(0, () => {
      const { port } = server.address() as AddressInfo
      server.close(() => resolve(port))
    })
    server.on('error', reject)
  })

const runStart = (args: string[]) => captureOutput(() => Start.run(args, import.meta.url))

describe('start', () => {
  const defaultRedirectPort = config.redirectPort
  let authUrlRequests: Record<string, unknown>[]

  // The login aborts before the mocked request if the redirect port is busy, so use one that is free.
  // runCommand would load the command with its own copy of config, hence Start.run below.
  before(async () => {
    config.redirectPort = await getFreePort()
  })

  after(() => {
    config.redirectPort = defaultRedirectPort
  })

  beforeEach(() => {
    authUrlRequests = []
    // Failing the auth url request stops the login before a browser or callback server is started.
    nock(config.bffHost)
      .post('/api/auth/url', (body) => authUrlRequests.push(body) > 0)
      .reply(400, { message: 'stop' })
  })

  afterEach(() => nock.cleanAll())

  it('logs in with the provider given by --provider', async () => {
    await runStart(['--provider', 'github'])

    expect(authUrlRequests).to.have.length(1)
    expect(authUrlRequests[0].provider).to.equal('github')
  })

  it('omits the provider without --provider, as before the flag existed', async () => {
    await runStart([])

    expect(authUrlRequests).to.have.length(1)
    expect(authUrlRequests[0]).not.to.have.property('provider')
  })

  it('hints at --provider and the supported providers', async () => {
    const { stdout } = await runStart([])

    expect(stdout).to.contain('Logging in via the default login page.')
    expect(stdout).to.contain('affinidi start --provider <affinidi|google|microsoft|apple|github>')
  })

  it('names the chosen provider in the hint', async () => {
    const { stdout } = await runStart(['--provider', 'github'])

    expect(stdout).to.contain('Logging in with github.')
  })

  it('rejects an unsupported provider', async () => {
    const { error } = await runStart(['--provider', 'facebook'])

    expect(error?.message).to.contain('Expected --provider=facebook to be one of')
    expect(authUrlRequests).to.be.empty
  })
})
