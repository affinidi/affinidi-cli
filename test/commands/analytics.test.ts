import { expect, test } from '@oclif/test'

import { configService } from '../../src/services'
import * as prompts from '../../src/user-actions'
import { OPTIN_MESSAGE, OPTOUT_MESSAGE } from '../../src/commands/analytics'

const testUserId = '38efcc70-bbe1-457a-a6c7-b29ad9913648'
const testProjectId = 'random-test-project-id'

describe('analytics command', () => {
  beforeEach(() => {
    configService.create(testUserId, testProjectId)
  })
  afterEach(() => {
    configService.clear()
  })
  test
    .stdout()
    .stub(prompts, 'analyticsConsentPrompt', () => async () => false)
    .command(['analytics'])
    .it('Opts-out from analytics when answered no in the promp', (ctx) => {
      expect(ctx.stdout).to.contain(OPTOUT_MESSAGE)
      expect(configService.hasAnalyticsOptIn()).to.eq(false)
    })

  test
    .stdout()
    .stub(prompts, 'analyticsConsentPrompt', () => async () => true)
    .command(['analytics'])
    .it('Opts-in to analytics when answered yes in the promp', (ctx) => {
      expect(ctx.stdout).to.contain(OPTIN_MESSAGE)
      expect(configService.hasAnalyticsOptIn()).to.eq(true)
    })

  test
    .stdout()
    .stub(prompts, 'analyticsConsentPrompt', () => async () => true)
    .command(['analytics', 'true'])
    .it('Set analytics opt-in', (ctx) => {
      expect(ctx.stdout).to.contain(OPTIN_MESSAGE)
      expect(configService.hasAnalyticsOptIn()).to.eq(true)
    })

  test
    .stdout()
    .stub(prompts, 'analyticsConsentPrompt', () => async () => false)
    .command(['analytics', 'false'])
    .it('Unset analytics opt-in', (ctx) => {
      expect(ctx.stdout).to.contain(OPTOUT_MESSAGE)
      expect(configService.hasAnalyticsOptIn()).to.eq(false)
    })
})
