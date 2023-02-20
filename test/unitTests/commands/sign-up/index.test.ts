import { CliUx } from '@oclif/core'
import { expect, test } from '@oclif/test'
import { StatusCodes } from 'http-status-codes'

import { getWelcomeUserRawMessages } from '../../../../src/render/functions'
import { WrongEmailError } from '../../../../src/errors'
import { createSession, USER_MANAGEMENT_URL } from '../../../../src/services/user-management'
import * as prompts from '../../../../src/user-actions'
import { analyticsService, configService } from '../../../../src/services'
import { vaultService } from '../../../../src/services/vault/typedVaultService'
import * as config from '../../../../src/services/config'
import { IAM_URL } from '../../../../src/services/iam'
import { projectSummary3 } from '../../../../src/fixtures/mock-projects'

const validEmailAddress = 'valid@email-address.com'
const validCookie =
  'console_authtoken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIzOGVmY2M3MC1iYmUxLTQ1N2EtYTZjNy1iMjlhZDk5MTM2NDgiLCJ1c2VybmFtZSI6InZhbGlkQGVtYWlsLWFkZHJlc3MuY29tIiwiYWNjZXNzVG9rZW4iOiJtb2NrZWQtYWNjZXNzLXRva2VuIiwiZXhwIjoxNjY4MDA0Njk3LCJpYXQiOjE2Njc5MTgyOTd9.WDOeDB6PwFkmXWhe4zmMnltJGB44ayvDYaHDKJlcZEQ; Domain=affinidi.com; Path=/; Expires=Wed, 09 Nov 2022 14:38:17 GMT; HttpOnly; Secure; SameSite=Lax'
const testUserId = '38efcc70-bbe1-457a-a6c7-b29ad9913648'
const testOTP = '123456'
const secondEmailAddress = 'second@email-address.com'
const secondCookie =
  'console_authtoken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI5MTYyM2M4OS04NzNmLTQ5NTYtYTc4Mi04YzEwNDY2MWZjYjIiLCJ1c2VybmFtZSI6InNlY29uZEBlbWFpbC1hZGRyZXNzLmNvbSIsImFjY2Vzc1Rva2VuIjoibW9ja2VkLWFjY2Vzcy10b2tlbiIsImV4cCI6MTY2ODAwNDY5NywiaWF0IjoxNjY3OTE4Mjk3fQ.TdjWsZgo5Fbu2m8guNTzhVuhtqw5XQPW7_jJ7YNPNoE;'
const secondUserId = '91623c89-873f-4956-a782-8c104661fcb2'
const doNothing = () => {}

const clearSessionAndConfig = () => {
  vaultService.clear()
  configService.clear()
}

describe('sign-up command', () => {
  before(() => {
    clearSessionAndConfig()
    configService.createOrUpdate(testUserId, true)
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
        configService.createOrUpdate(testUserId, true)
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
        .nock(`${IAM_URL}`, (api) =>
          api.post('/projects').reply(StatusCodes.OK, {
            projectId: projectSummary3.project.projectId,
            name: projectSummary3.project.name,
            createdAt: projectSummary3.project.createdAt,
          }),
        )
        .nock(`${IAM_URL}`, (api) =>
          api
            .get(`/projects/${projectSummary3.project.projectId}/summary`)
            .reply(StatusCodes.OK, projectSummary3),
        )
        .stdout()
        .stub(prompts, 'enterEmailPrompt', () => async () => validEmailAddress)
        .stub(prompts, 'acceptConditionsAndPolicy', () => async () => prompts.AnswerYes)
        .stub(prompts, 'enterOTPPrompt', () => async () => testOTP)
        .stub(prompts, 'analyticsConsentPrompt', () => async () => true)
        .stub(CliUx.ux.action, 'start', () => () => doNothing)
        .stub(CliUx.ux.action, 'stop', () => doNothing)
        .command(['sign-up'])
        .it('runs sign-up, shows a welcome message, creates and activates a project', (ctx) => {
          const output = ctx.stdout
          getWelcomeUserRawMessages().forEach((b) => {
            expect(output).to.contain(b)
          })

          const currentConf = configService.show()
          expect(currentConf.currentUserId).to.equal(testUserId)
          expect(currentConf.version).to.equal(config.getMajorVersion())
          expect(currentConf.configs).to.haveOwnProperty(testUserId)
          expect(currentConf.configs[testUserId].activeProjectId).to.equal('')
          expect(currentConf.configs[testUserId].outputFormat).to.equal('plaintext')
          // eslint-disable-next-line @typescript-eslint/no-unused-expressions
          expect(analyticsService.hasAnalyticsOptIn()).to.be.true
          const { project } = vaultService.getActiveProject()
          expect(project.name).to.equal(projectSummary3.project.name)
        })
    })

    describe('Given an already logged in user', () => {
      before(() => {
        createSession('email', testUserId, 'sessionToken')
        configService.createOrUpdate(testUserId, true)
        // vaultService.setActiveProject(projectSummary)
      })
      describe('When the user tries to sign-up with a new account', () => {
        test
          .nock(`${USER_MANAGEMENT_URL}`, (api) =>
            api.post('/auth/signup').reply(StatusCodes.OK, { token: 'some-valid-token' }),
          )
          .nock(`${USER_MANAGEMENT_URL}`, (api) =>
            api
              .post('/auth/signup/confirm')
              .reply(StatusCodes.OK, null, { 'set-cookie': [secondCookie] }),
          )
          .nock(`${IAM_URL}`, (api) =>
            api.post('/projects').reply(StatusCodes.OK, {
              projectId: projectSummary3.project.projectId,
              name: projectSummary3.project.name,
              createdAt: projectSummary3.project.createdAt,
            }),
          )
          .nock(`${IAM_URL}`, (api) =>
            api
              .get(`/projects/${projectSummary3.project.projectId}/summary`)
              .reply(StatusCodes.OK, projectSummary3),
          )
          .stdout()
          .stub(prompts, 'enterEmailPrompt', () => async () => secondEmailAddress)
          .stub(prompts, 'acceptConditionsAndPolicy', () => async () => prompts.AnswerYes)
          .stub(prompts, 'enterOTPPrompt', () => async () => testOTP)
          .stub(prompts, 'analyticsConsentPrompt', () => async () => true)
          .command(['sign-up'])
          .it(
            'runs sign-up and verifies that the credentials.json file contains the new user config',
            (ctx) => {
              const output = ctx.stdout
              getWelcomeUserRawMessages().forEach((b) => {
                expect(output).to.contain(b)
              })
              const { project } = vaultService.getActiveProject()
              expect(project.name).to.equal(projectSummary3.project.name)
              const { configs } = configService.show()
              expect(Object.keys(configs)).to.have.lengthOf(2)
              expect(configs).to.have.property(secondUserId)
            },
          )
      })
    })
  })
})
