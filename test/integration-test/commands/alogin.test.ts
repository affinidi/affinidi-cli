import { expect, test } from '@oclif/test'
import { assert } from 'chai'

import * as prompts from '../../../src/user-actions'
import { getSession } from '../../../src/services/user-management'
import { testInbox } from '../helpers/TestMailInbox'

const getCode = async (): Promise<string> => {
  const code = (await testInbox.waitForNewEmail()).body.split(' ').at(-1).replace('.', '')

  return code
}

describe('User login', () => {
  test
    .stdout()
    .stdin('\n', 35000)
    .stub(prompts, 'analyticsConsentPrompt', () => async () => prompts.AnswerNo)
    .stub(prompts, 'enterOTPPrompt', () => async () => getCode())
    .stub(prompts, 'confirmSignOut', () => async () => prompts.AnswerYes)
    .command(['login', `${testInbox.email}`])
    .it('logs in the user and activates a project', async (ctx) => {
      const session = getSession()
      expect(ctx.stdout).to.contains('Welcome back')
      assert.exists(session)
    })
})
