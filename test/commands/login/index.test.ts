import { CliUx } from '@oclif/core'
import { expect, test } from '@oclif/test'
import { StatusCodes } from 'http-status-codes'

import {
  InvalidOrExpiredOTPError,
  UserManagementServiceDownError,
  WrongEmailError,
} from '../../../src/errors'
import { USER_MANAGEMENT_URL } from '../../../src/services/user-management'
import * as prompts from '../../../src/user-actions'

const validEmailAddress = 'valid@email-address.com'
const testOTP = '123456'
const doNothing = () => {}

describe('login command', () => {
  test
    .stdout()
    .stub(prompts, 'enterEmailPrompt', () => async () => 'invalid.email.address')
    .command(['login'])
    .it('runs login with an invalid email address', (ctx) => {
      expect(ctx.stdout).to.contain(WrongEmailError)
    })

  describe('Given a valid email address', () => {
    describe('When the user-management service is down', () => {
      test
        .stdout()
        .nock(`${USER_MANAGEMENT_URL}`, (api) =>
          api.post('/auth/login').replyWithError(UserManagementServiceDownError),
        )
        .stub(prompts, 'enterEmailPrompt', () => async () => validEmailAddress)
        .stub(CliUx.ux.action, 'start', () => () => doNothing)
        .stub(CliUx.ux.action, 'stop', () => doNothing)
        .command(['login'])
        .it('runs login and shows the user that something went wrong', (ctx) => {
          // TODO: the error message is contained twice in the ctx.stdout
          expect(ctx.stdout).to.contain(UserManagementServiceDownError)
        })
    })

    describe('When the user enters a wrong OTP', () => {
      test
        .nock(`${USER_MANAGEMENT_URL}`, (api) =>
          api.post('/auth/login').reply(StatusCodes.OK, { token: 'some-valid-token' }),
        )
        .nock(`${USER_MANAGEMENT_URL}`, (api) =>
          api.post('/auth/login/confirm').reply(StatusCodes.BAD_REQUEST),
        )
        .stdout()
        .stub(prompts, 'enterEmailPrompt', () => async () => validEmailAddress)
        .stub(prompts, 'enterOTPPrompt', () => async () => testOTP)
        .stub(CliUx.ux.action, 'start', () => () => doNothing)
        .stub(CliUx.ux.action, 'stop', () => doNothing)
        .command(['login'])
        .it('runs login explains to the user that the OTP was invalid', (ctx) => {
          expect(ctx.stdout).to.contain(InvalidOrExpiredOTPError)
        })
    })

    describe('When the user enters the valid OTP', () => {
      test
        .nock(`${USER_MANAGEMENT_URL}`, (api) =>
          api.post('/auth/login').reply(StatusCodes.OK, { token: 'some-valid-token' }),
        )
        .nock(`${USER_MANAGEMENT_URL}`, (api) =>
          api
            .post('/auth/login/confirm')
            .reply(StatusCodes.OK, null, { 'set-cookie': ['valid-cookie'] }),
        )
        .stdout()
        .stub(prompts, 'enterEmailPrompt', () => async () => validEmailAddress)
        .stub(prompts, 'enterOTPPrompt', () => async () => testOTP)
        .stub(CliUx.ux.action, 'start', () => () => doNothing)
        .stub(CliUx.ux.action, 'stop', () => doNothing)
        .command(['login'])
        .it('runs login and shows a welcome back user message', (ctx) => {
          expect(ctx.stdout).to.contain('You are authenticated')
          expect(ctx.stdout).to.contain(`Welcome back to Affinidi ${validEmailAddress}!`)
        })
    })
  })
})
