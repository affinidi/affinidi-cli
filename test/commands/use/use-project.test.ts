import { expect, test } from '@oclif/test'
import { StatusCodes } from 'http-status-codes'

import { IAM_URL } from '../../../src/services/iam'
import { projectSummary } from '../../../src/fixtures/mock-projects'
import { ServiceDownError, Unauthorized } from '../../../src/errors'
import { ANALYTICS_URL } from '../../../src/services/analytics'
import { configService } from '../../../src/services'
import { createSession } from '../../../src/services/user-management'

const testUserId = '38efcc70-bbe1-457a-a6c7-b29ad9913648'
const testProjectId = 'random-test-project-id'

describe('use project command', () => {
  before(() => {
    createSession('email', testUserId, 'sessionToken')
    configService.create(testUserId, testProjectId)
    configService.optInOrOut(true)
  })
  after(() => {
    configService.clear()
  })
  test
    .nock(`${IAM_URL}`, (api) =>
      api
        .get(`/projects/${projectSummary.project.projectId}/summary`)
        .reply(StatusCodes.OK, projectSummary),
    )
    .stdout()
    .command(['use project', projectSummary.project.projectId])
    .it('runs use project with a specific project-id', (ctx) => {
      expect(ctx.stdout).to.contain('name : Awesome project')
      expect(ctx.stdout).to.contain('projectId : some-project1-id')
      expect(ctx.stdout).to.contain('apiKeyHash : ********************')
    })
  describe('Activating a project while not authorized', () => {
    test
      .nock(`${IAM_URL}`, (api) =>
        api
          .get(`/projects/${projectSummary.project.projectId}/summary`)
          .reply(StatusCodes.UNAUTHORIZED),
      )
      .stdout()
      .command(['use project', projectSummary.project.projectId])
      .it('runs use project while user is unauthorized', (ctx) => {
        expect(ctx.stdout).to.contain(Unauthorized)
      })
  })
  describe('Activating a project and server is down', () => {
    test
      .nock(`${IAM_URL}`, (api) =>
        api
          .get(`/projects/${projectSummary.project.projectId}/summary`)
          .reply(StatusCodes.INTERNAL_SERVER_ERROR),
      )
      .stdout()
      .command(['use project', projectSummary.project.projectId])
      .it('runs use project while the service is down', (ctx) => {
        expect(ctx.stdout).to.contain(ServiceDownError)
      })
  })
})
