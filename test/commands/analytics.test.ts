import { expect, test } from '@oclif/test'
import { vaultService, VAULT_KEYS } from '../../src/services'

describe('analytics', () => {
  after(() => {
    vaultService.clear()
  })
  test
    .stdout()
    .command(['analytics'])
    .it('Checks analytics', (ctx) => {
      expect(ctx.stdout).to.contain('You have opted in to analytics')
    })

  test
    .stdout()
    .command(['analytics', 'true'])
    .it('Set analytics opt-in', (ctx) => {
      expect(ctx.stdout).to.contain('You have opted in to analytics')
      expect(vaultService.get(VAULT_KEYS.analyticsOptIn)).to.eq('true')
    })

  test
    .stdout()
    .command(['analytics', 'false'])
    .it('Unset analytics opt-in', (ctx) => {
      expect(ctx.stdout).to.contain('You have not opted in to analytics')
      expect(vaultService.get(VAULT_KEYS.analyticsOptIn)).to.eq('false')
    })
})
