import { CliUx } from '@oclif/core'
import { expect, test } from '@oclif/test'
import { StatusCodes } from 'http-status-codes'

import { IAM_URL } from '../../../../src/services/iam'
import * as userActions from '../../../../src/user-actions'
import {
  projectList,
  projectSummary,
  projectSummary3,
} from '../../../../src/fixtures/mock-projects'
import { USER_MANAGEMENT_URL } from '../../../../src/services/user-management'
import { getSignupNextStepRawMessages } from '../../../../src/render/functions'
import {
  InvalidOrExpiredOTPError,
  ServiceDownError,
  WrongEmailError,
  notFoundProject,
} from '../../../../src/errors'
import { analyticsService, configService } from '../../../../src/services'
import { vaultService } from '../../../../src/services/vault/typedVaultService'
import * as config from '../../../../src/services/config'

const validEmailAddress = 'valid@email-address.com'
const testUserId = '38efcc70-bbe1-457a-a6c7-b29ad9913648'
const testProjectId = 'random-test-project-id'
const testOTP = '123456'
const validCookie =
  'console_authtoken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIzOGVmY2M3MC1iYmUxLTQ1N2EtYTZjNy1iMjlhZDk5MTM2NDgiLCJ1c2VybmFtZSI6InZhbGlkQGVtYWlsLWFkZHJlc3MuY29tIiwiYWNjZXNzVG9rZW4iOiJtb2NrZWQtYWNjZXNzLXRva2VuIiwiZXhwIjoxNjY4MDA0Njk3LCJpYXQiOjE2Njc5MTgyOTd9.WDOeDB6PwFkmXWhe4zmMnltJGB44ayvDYaHDKJlcZEQ; Domain=affinidi.com; Path=/; Expires=Wed, 09 Nov 2022 14:38:17 GMT; HttpOnly; Secure; SameSite=Lax'
const secondEmailAddress = 'second@email-address.com'
const secondCookie =
  'console_authtoken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI5MTYyM2M4OS04NzNmLTQ5NTYtYTc4Mi04YzEwNDY2MWZjYjIiLCJ1c2VybmFtZSI6InNlY29uZEBlbWFpbC1hZGRyZXNzLmNvbSIsImFjY2Vzc1Rva2VuIjoibW9ja2VkLWFjY2Vzcy10b2tlbiIsImV4cCI6MTY2ODAwNDY5NywiaWF0IjoxNjY3OTE4Mjk3fQ.TdjWsZgo5Fbu2m8guNTzhVuhtqw5XQPW7_jJ7YNPNoE;'
const secondUserId = '91623c89-873f-4956-a782-8c104661fcb2'
const doNothing = () => {}

const clearSessionAndConfig = () => {
  vaultService.clear()
  configService.clear()
}

const setupTest = (cookie: string, email: string) => {
  return test
    .nock(`${USER_MANAGEMENT_URL}`, (api) =>
      api.post('/auth/login').reply(StatusCodes.OK, { token: 'some-valid-token' }),
    )
    .nock(`${USER_MANAGEMENT_URL}`, (api) =>
      api.post('/auth/login/confirm').reply(StatusCodes.OK, null, { 'set-cookie': [cookie] }),
    )
    .stdout()
    .stub(userActions, 'enterEmailPrompt', () => async () => email)
    .stub(userActions, 'enterOTPPrompt', () => async () => testOTP)
    .stub(CliUx.ux.action, 'start', () => () => doNothing)
    .stub(CliUx.ux.action, 'stop', () => doNothing)
}

describe('login command', () => {
  before(() => {
    configService.create(testUserId, testProjectId)
    configService.optInOrOut(true)
  })
  after(() => {
    configService.clear()
  })
  describe('Given an invalid email address', () => {
    test
      .stdout()
      .stub(userActions, 'enterEmailPrompt', () => async () => 'invalid.email.address')
      .command(['login'])
      .it('runs login with an invalid email address', (ctx) => {
        expect(ctx.stdout).to.contain(WrongEmailError)
      })
  })

  describe('Given a valid email address', () => {
    describe('When the user-management service is down', () => {
      test
        .stdout()
        .nock(`${USER_MANAGEMENT_URL}`, (api) =>
          api.post('/auth/login').reply(StatusCodes.INTERNAL_SERVER_ERROR),
        )
        .stub(userActions, 'enterEmailPrompt', () => async () => validEmailAddress)
        .stub(CliUx.ux.action, 'start', () => () => doNothing)
        .stub(CliUx.ux.action, 'stop', () => doNothing)
        .command(['login'])
        .it('runs login and shows the user that something went wrong', (ctx) => {
          // TODO: the error message is contained twice in the ctx.stdout
          expect(ctx.stdout).to.contain(ServiceDownError)
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
        .stub(userActions, 'enterEmailPrompt', () => async () => validEmailAddress)
        .stub(userActions, 'enterOTPPrompt', () => async () => testOTP)
        .stub(CliUx.ux.action, 'start', () => () => doNothing)
        .stub(CliUx.ux.action, 'stop', () => doNothing)
        .command(['login'])
        .it('runs login explains to the user that the OTP was invalid', (ctx) => {
          expect(ctx.stdout).to.contain(InvalidOrExpiredOTPError)
        })
    })

    describe('When the user enters the valid OTP', () => {
      describe('And When the user has no project', () => {
        before(() => {
          configService.create(testUserId, testProjectId)
          configService.optInOrOut(true)
        })
        after(() => {
          vaultService.clear()
        })
        setupTest(validCookie, validEmailAddress)
          .nock(`${IAM_URL}`, (api) => api.get('/projects').reply(StatusCodes.OK, { projects: [] }))
          .command(['login'])
          .it(
            'runs login and shows a welcome back message with the next steps to follow',
            (ctx) => {
              const output = ctx.stdout
              expect(output).to.contain('You are authenticated')
              expect(output).to.contain(`Welcome back to Affinidi ${validEmailAddress}!`)
              getSignupNextStepRawMessages().forEach((b) => {
                expect(output).to.contain(b)
              })
            },
          )
      })

      describe('And When the user has 1 project', () => {
        before(() => {
          configService.create(testUserId, testProjectId)
          configService.optInOrOut(true)
        })
        after(() => {
          clearSessionAndConfig()
        })
        setupTest(validCookie, validEmailAddress)
          .nock(`${IAM_URL}`, (api) =>
            api.get('/projects').reply(StatusCodes.OK, { projects: [projectList.projects[0]] }),
          )
          .nock(`${IAM_URL}`, (api) =>
            api
              .get(`/projects/${projectSummary.project.projectId}/summary`)
              .reply(StatusCodes.OK, projectSummary),
          )
          .command(['login'])
          .it('runs login and activates the project ', (ctx) => {
            const output = ctx.stdout
            expect(output).to.contain('You are authenticated')
            expect(output).to.contain(`Welcome back to Affinidi ${validEmailAddress}!`)
          })

        test
          .nock(`${IAM_URL}`, (api) =>
            api
              .get(`/projects/${projectSummary.project.projectId}/summary`)
              .reply(StatusCodes.OK, projectSummary),
          )
          .stub(CliUx.ux.action, 'start', () => () => doNothing)
          .stub(CliUx.ux.action, 'stop', () => doNothing)
          .stdout()
          .command(['show project', '-a'])
          .it("chains the show project and doesn't throw an error", (ctx) => {
            expect(ctx.stdout).to.not.contain(notFoundProject)
          })

        it('checks that the config contains some data', () => {
          const currentConfig = configService.show()
          expect(currentConfig.currentUserId).to.equal(testUserId)
          expect(currentConfig.version).to.equal(config.getMajorVersion())
          expect(currentConfig.configs).to.haveOwnProperty(testUserId)
          expect(currentConfig.configs[testUserId].activeProjectId).to.equal(
            projectSummary.project.projectId,
          )
          expect(currentConfig.configs[testUserId].outputFormat).to.equal('plaintext')
        })
      })

      describe('And When the user has several projects', () => {
        before(() => {
          configService.create(testUserId, testProjectId)
          configService.optInOrOut(true)
        })
        after(() => {
          clearSessionAndConfig()
        })
        const projectId3 = projectSummary3.project.projectId
        test
          .nock(`${USER_MANAGEMENT_URL}`, (api) =>
            api.post('/auth/login').reply(StatusCodes.OK, { token: 'some-valid-token' }),
          )
          .nock(`${USER_MANAGEMENT_URL}`, (api) =>
            api
              .post('/auth/login/confirm')
              .reply(StatusCodes.OK, null, { 'set-cookie': [validCookie] }),
          )
          .nock(`${IAM_URL}`, (api) =>
            api.get('/projects').reply(StatusCodes.OK, { projects: [...projectList.projects] }),
          )
          .nock(`${IAM_URL}`, (api) =>
            api.get('/projects').reply(StatusCodes.OK, { projects: [...projectList.projects] }),
          )
          .nock(`${IAM_URL}`, (api) =>
            api.get(`/projects/${projectId3}/summary`).reply(StatusCodes.OK, projectSummary3),
          )
          .stub(userActions, 'enterEmailPrompt', () => async () => validEmailAddress)
          .stub(userActions, 'enterOTPPrompt', () => async () => testOTP)
          .stub(CliUx.ux.action, 'start', () => () => doNothing)
          .stub(CliUx.ux.action, 'stop', () => doNothing)
          .stub(userActions, 'selectProject', () => async () => projectId3)
          .stdout()
          .command(['login'])
          .it('runs login and activates the selected project ', (ctx) => {
            const output = ctx.stdout
            expect(output).to.contain('You are authenticated')
            expect(output).to.contain(`Welcome back to Affinidi ${validEmailAddress}!`)
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            expect(analyticsService.hasAnalyticsOptIn()).to.be.true
          })

        test
          .nock(`${IAM_URL}`, (api) =>
            api
              .get(`/projects/${projectSummary3.project.projectId}/summary`)
              .reply(StatusCodes.OK, projectSummary3),
          )
          .stub(CliUx.ux.action, 'start', () => () => doNothing)
          .stub(CliUx.ux.action, 'stop', () => doNothing)
          .stdout()
          .command(['show project', '-a'])
          .it("chains the show project and doesn't throw an error", (ctx) => {
            expect(ctx.stdout).to.not.contain(notFoundProject)
          })

        it('checks that the config contains some data', () => {
          const currentConfig = configService.show()
          expect(currentConfig.currentUserId).to.equal(testUserId)
          expect(currentConfig.version).to.equal(config.getMajorVersion())
          expect(currentConfig.configs).to.haveOwnProperty(testUserId)
          expect(currentConfig.configs[testUserId].activeProjectId).to.equal(
            projectSummary3.project.projectId,
          )
          expect(currentConfig.configs[testUserId].outputFormat).to.equal('plaintext')
        })
      })
    })
  })

  describe('Given an already logged in user  ', () => {
    describe('When another user logs-in', () => {
      before(() => {
        configService.createOrUpdate(testUserId, true)
      })
      setupTest(secondCookie, secondEmailAddress)
        .nock(`${IAM_URL}`, (api) => api.get('/projects').reply(StatusCodes.OK, { projects: [] }))
        .stub(userActions, 'analyticsConsentPrompt', () => async () => true)
        .command(['login'])
        .it(
          'runs login and verifies that the credentials.json file contains the new user config',
          () => {
            const { configs } = configService.show()
            expect(Object.keys(configs)).to.have.lengthOf(2)
            expect(configs).to.have.property(secondUserId)
          },
        )
    })
  })
})
