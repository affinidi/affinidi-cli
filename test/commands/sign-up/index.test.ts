import { CliUx } from '@oclif/core'
import { expect, test } from '@oclif/test'
import { StatusCodes } from 'http-status-codes'

import { welcomeMessageBlocks } from '../../../src/render/functions'
import { WrongEmailError } from '../../../src/errors'
import { USER_MANAGEMENT_URL } from '../../../src/services/user-management'
import * as prompts from '../../../src/user-actions'

const validEmailAddress = 'valid@email-address.com'
const testOTP = '123456'
const doNothing = () => {}

describe('sign-up command', () => {
  test
    .stdout()
    .stub(prompts, 'enterEmailPrompt', () => async () => 'invalid.email.address')
    .command(['sign-up'])
    .it('runs signup with an invalid email address', (ctx) => {
      expect(ctx.stdout).to.contain(WrongEmailError)
    })

  describe('Given a valid email address', () => {
    describe("When user doesn't accept the conditions and policy", () => {
      test
        .stdout()
        .stub(prompts, 'enterEmailPrompt', () => async () => validEmailAddress)
        .stub(prompts, 'acceptConditionsAndPolicy', () => async () => prompts.AnswerNo)
        .stub(CliUx.ux.action, 'start', () => () => doNothing)
        .stub(CliUx.ux.action, 'stop', () => doNothing)
        .command(['sign-up'])
        .it('runs sign-up and stops', (ctx) => {
          expect(ctx.stdout).to.be.string('')
        })
    })

    test
      .nock(`${USER_MANAGEMENT_URL}`, (api) =>
        api.post('/auth/signup').reply(StatusCodes.OK, { token: 'some-valid-token' }),
      )
      .nock(`${USER_MANAGEMENT_URL}`, (api) =>
        api
          .post('/auth/signup/confirm')
          .reply(StatusCodes.OK, null, { 'set-cookie': ['valid-cookie'] }),
      )
      .stdout()
      .stub(prompts, 'enterEmailPrompt', () => async () => validEmailAddress)
      .stub(prompts, 'acceptConditionsAndPolicy', () => async () => prompts.AnswerYes)
      .stub(prompts, 'enterOTPPrompt', () => async () => testOTP)
      .stub(CliUx.ux.action, 'start', () => () => doNothing)
      .stub(CliUx.ux.action, 'stop', () => doNothing)
      .command(['sign-up'])
      .it('runs sign-up and shows a welcome back message', (ctx) => {
        expect(ctx.stdout).to.contain(welcomeMessageBlocks[0])
        expect(ctx.stdout).to.contain(welcomeMessageBlocks[1])
        expect(ctx.stdout).to.contain(welcomeMessageBlocks[2])
      })
  })
})
