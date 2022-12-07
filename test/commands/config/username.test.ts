import { expect, test } from '@oclif/test'
import { Unauthorized } from '../../../src/errors'
import { configService, vaultService } from '../../../src/services'
import { createSession, createConfig } from '../../../src/services/user-management'

const testUserId = '38efcc70-bbe1-457a-a6c7-b29ad9913648'
const testProjectId = 'random-test-project-id'
const testEmail = 'example@email.com'

describe('username', () => {
  after(() => {
    vaultService.clear()
  })
  describe('set username', () => {
    before(() => {
      createSession('email', testUserId, 'sessionToken')
      createConfig({ userId: testUserId, projectId: testProjectId })
    })
    test
      .stdout()
      .command(['config username', testEmail])
      .it('it runs config username to set username in config.json', (ctx) => {
        const config = configService.show()
        expect(config.username).to.equal(testEmail)
        expect(ctx.stdout).to.contain('Your username is set')
      })
  })
  describe('unset username', () => {
    before(() => {
      createSession('email', testUserId, 'sessionToken')
      createConfig({ userId: testUserId, projectId: testProjectId })
    })
    test
      .stdout()
      .command(['config username', '--unset'])
      .it('it runs config username to unset username in config.json', (ctx) => {
        const config = configService.show()
        expect(config.username).to.equal('')
        expect(ctx.stdout).to.contain('Your username is unset')
      })
  })
  describe('unauthorized', () => {
    before(() => {
      vaultService.clear()
      createConfig({ userId: testUserId, projectId: testProjectId })
    })
    test
      .stdout()
      .command(['config username', testEmail])
      .it('it runs config username while unauthorized', (ctx) => {
        expect(ctx.stdout).to.contain(Unauthorized)
      })
  })
})
