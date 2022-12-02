import { expect, test } from '@oclif/test'

import { vaultService, VAULT_KEYS } from '../../src/services'
import * as prompts from '../../src/user-actions'
import { OPTIN_MESSAGE, OPTOUT_MESSAGE } from '../../src/commands/analytics'

describe('analytics', () => {
  afterEach(() => {
    vaultService.clear()
  })

  test
    .stdout()
    .stub(prompts, 'analyticsConsentPrompt', () => async () => false)
    .command(['analytics'])
    .it('Opts-out from analytics when answered no in the promp', (ctx) => {
      expect(ctx.stdout).to.contain(OPTOUT_MESSAGE)
      expect(vaultService.get(VAULT_KEYS.analyticsOptIn)).to.eq('false')
    })

  test
    .stdout()
    .stub(prompts, 'analyticsConsentPrompt', () => async () => true)
    .command(['analytics'])
    .it('Opts-out from analytics when answered no in the promp', (ctx) => {
      expect(ctx.stdout).to.contain(OPTIN_MESSAGE)
      expect(vaultService.get(VAULT_KEYS.analyticsOptIn)).to.eq('true')
    })

  test

    .stdout()
    .stub(prompts, 'analyticsConsentPrompt', () => async () => true)
    .command(['analytics', 'true'])
    .it('Set analytics opt-in', (ctx) => {
      expect(ctx.stdout).to.contain(OPTIN_MESSAGE)
      expect(vaultService.get(VAULT_KEYS.analyticsOptIn)).to.eq('true')
    })

  test
    .stdout()
    .stub(prompts, 'analyticsConsentPrompt', () => async () => false)
    .command(['analytics', 'false'])
    .it('Unset analytics opt-in', (ctx) => {
      expect(ctx.stdout).to.contain(OPTOUT_MESSAGE)
      expect(vaultService.get(VAULT_KEYS.analyticsOptIn)).to.eq('false')
    })
})
