import { expect, test } from '@oclif/test'
import { testInbox } from '../helpers'
import * as prompts from '../../../src/user-actions'

const getCode = async (): Promise<string> => {
  const code = (await testInbox.waitForNewEmail()).body.split(' ').at(-1).replace('.', '')

  return code
}

describe('Login user', () => {
  test
    .stdout()
    .stdin('\n', 10000)
    .stub(prompts, 'analyticsConsentPrompt', () => async () => prompts.AnswerNo)
    .stub(prompts, 'enterOTPPrompt', () => async () => getCode())
    .stub(prompts, 'confirmSignOut', () => async () => prompts.AnswerYes)
    .command(['login', `${testInbox.email}`])
    .it('logs in the user and activates a project', async (ctx) => {
      expect(ctx.stdout).to.contains('Welcome back')
    })
})
