import { expect, test } from '@oclif/test'
import { Unauthorized } from '../../../src/errors'
import { vaultService } from '../../../src/services/vault/typedVaultService'
import { configService } from '../../../src/services/config'
import { createSession, createConfig } from '../../../src/services/user-management'

const testUserId = '38efcc70-bbe1-457a-a6c7-b29ad9913648'
const testProjectId = 'random-test-project-id'

describe('config view command', () => {
  after(() => {
    vaultService.clear()
  })
  describe('change from plaintext to json', () => {
    before(() => {
      createSession('email', testUserId, 'sessionToken')
      createConfig({ userId: testUserId, projectId: testProjectId })
    })
    test
      .stdout()
      .command(['config view', 'json'])
      .it('it runs config view to change default output view to json', (ctx) => {
        const config = configService.show()
        expect(config.configs[testUserId].outputFormat).to.equal('json')
        expect(ctx.stdout).to.contain('Default output format view is set to json')
      })
  })
  describe('change from json to plaintext', () => {
    before(() => {
      createSession('email', testUserId, 'sessionToken')
      createConfig({ userId: testUserId, projectId: testProjectId })
      configService.setOutputFormat('json')
    })
    test
      .stdout()
      .command(['config view', 'plaintext'])
      .it('it runs config view to change default output view to plaintext', (ctx) => {
        const config = configService.show()
        expect(config.configs[testUserId].outputFormat).to.equal('plaintext')
        expect(ctx.stdout).to.contain('Default output format view is set to plaintext')
      })
  })
  describe('unauthorized', () => {
    before(() => {
      vaultService.clear()
      createConfig({ userId: testUserId, projectId: testProjectId })
    })
    test
      .stdout()
      .command(['config view', 'plaintext'])
      .it('it runs config view while unauthorized', (ctx) => {
        expect(ctx.stdout).to.contain(Unauthorized)
      })
  })
})
