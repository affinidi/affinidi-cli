import { CliUx } from '@oclif/core'
import { expect, test } from '@oclif/test'
import { StatusCodes } from 'http-status-codes'

import { getWelcomeUserRawMessages } from '../../../src/render/functions'
import { WrongEmailError } from '../../../src/errors'
import { USER_MANAGEMENT_URL } from '../../../src/services/user-management'
import * as prompts from '../../../src/user-actions'
import { analyticsService, ANALYTICS_URL } from '../../../src/services/analytics'
import { configService } from '../../../src/services'
import { vaultService } from '../../../src/services/vault/typedVaultService'
import * as config from '../../../src/services/config'

const validEmailAddress = 'valid@email-address.com'
const validCookie =
  'console_authtoken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIzOGVmY2M3MC1iYmUxLTQ1N2EtYTZjNy1iMjlhZDk5MTM2NDgiLCJ1c2VybmFtZSI6InZhbGlkQGVtYWlsLWFkZHJlc3MuY29tIiwiYWNjZXNzVG9rZW4iOiJtb2NrZWQtYWNjZXNzLXRva2VuIiwiZXhwIjoxNjY4MDA0Njk3LCJpYXQiOjE2Njc5MTgyOTd9.WDOeDB6PwFkmXWhe4zmMnltJGB44ayvDYaHDKJlcZEQ; Domain=affinidi.com; Path=/; Expires=Wed, 09 Nov 2022 14:38:17 GMT; HttpOnly; Secure; SameSite=Lax'
const testUserId = '38efcc70-bbe1-457a-a6c7-b29ad9913648'
const testProjectId = 'random-test-project-id'
const testOTP = '123456'
const doNothing = () => {}

const clearSessionAndConfig = () => {
  vaultService.clear()
  configService.clear()
}

describe('sign-up command', () => {
  before(() => {
    configService.create(testUserId, testProjectId)
  })
  after(clearSessionAndConfig)
  test
    .stdout()
    .stub(config, 'getMajorVersion', () => () => 5)
    .stub(prompts, 'enterEmailPrompt', () => async () => 'invalid.email.address')
    .command(['sign-up'])
    .it('runs signup and throws a wrong config version message', (ctx) => {
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

    describe('When user accepts the conditions and policy', () => {
      before(() => {
        clearSessionAndConfig()
        configService.create(testUserId, testProjectId)
      })
      test
        .nock(`${USER_MANAGEMENT_URL}`, (api) =>
          api.post('/auth/signup').reply(StatusCodes.OK, { token: 'some-valid-token' }),
        )
        .nock(`${USER_MANAGEMENT_URL}`, (api) =>
          api
            .post('/auth/signup/confirm')
            .reply(StatusCodes.OK, null, { 'set-cookie': [validCookie] }),
        )
        .nock(`${ANALYTICS_URL}`, (api) => api.post('/api/events').reply(StatusCodes.CREATED))
        .stdout()
        .stub(prompts, 'enterEmailPrompt', () => async () => validEmailAddress)
        .stub(prompts, 'acceptConditionsAndPolicy', () => async () => prompts.AnswerYes)
        .stub(prompts, 'enterOTPPrompt', () => async () => testOTP)
        .stub(prompts, 'analyticsConsentPrompt', () => async () => true)
        .stub(CliUx.ux.action, 'start', () => () => doNothing)
        .stub(CliUx.ux.action, 'stop', () => doNothing)
        .command(['sign-up'])
        .it('runs sign-up and shows a welcome message', (ctx) => {
          const output = ctx.stdout
          getWelcomeUserRawMessages().forEach((b) => {
            expect(output).to.contain(b)
          })

          const currentConf = configService.show()
          expect(currentConf.currentUserID).to.equal(testUserId)
          expect(currentConf.version).to.equal(config.getMajorVersion())
          expect(currentConf.configs).to.haveOwnProperty(testUserId)
          expect(currentConf.configs[testUserId].activeProjectId).to.equal('')
          expect(currentConf.configs[testUserId].outputFormat).to.equal('plaintext')
          // eslint-disable-next-line @typescript-eslint/no-unused-expressions
          expect(analyticsService.hasAnalyticsOptIn()).to.be.true
        })
    })
  })
})
