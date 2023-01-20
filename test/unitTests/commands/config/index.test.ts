import { expect, test } from '@oclif/test'
import { Unauthorized } from '../../../../src/errors'
import { vaultService } from '../../../../src/services/vault/typedVaultService'
import { configService } from '../../../../src/services/config'
import { createSession, createConfig } from '../../../../src/services/user-management'

const testUserId = '38efcc70-bbe1-457a-a6c7-b29ad9913648'
const testProjectId = 'random-test-project-id'

describe('config command', () => {
  before(() => {
    createSession('email', testUserId, 'sessionToken', [])
    createConfig({ userId: testUserId, projectId: testProjectId })
  })
  after(() => {
    vaultService.clear()
  })
  describe('delete user config', () => {
    test
      .stdout()
      .command(['config', '--unset-all'])
      .it("it runs config unset to remove user's config", (ctx) => {
        const config = configService.show()
        expect(config.configs).to.contain({})
        expect(ctx.stdout).to.contain('Your configuration is unset')
      })
  })
  describe('unauthorized', () => {
    before(() => {
      vaultService.clear()
    })
    test
      .stdout()
      .command(['config', '--unset-all'])
      .it('it runs config unset while unauthorized', (ctx) => {
        expect(ctx.stdout).to.contain(Unauthorized)
      })
  })
})
