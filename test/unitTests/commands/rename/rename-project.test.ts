import { expect, test } from '@oclif/test'
import { StatusCodes } from 'http-status-codes'

import { IAM_URL } from '../../../../src/services/iam'
import { projectSummary, projectSummaryRenamed } from '../../../../src/fixtures/mock-projects'
import { ServiceDownError, Unauthorized } from '../../../../src/errors'

import { configService } from '../../../../src/services'
import { createSession } from '../../../../src/services/user-management'
import { vaultService } from '../../../../src/services/vault/typedVaultService'

const testUserId = '38efcc70-bbe1-457a-a6c7-b29ad9913648'
const testProjectId = 'random-test-project-id'

describe('rename project command', () => {
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
        .patch(`/projects/${projectSummary.project.projectId}`)
        .reply(StatusCodes.OK, projectSummaryRenamed.project),
    )
    .nock(`${IAM_URL}`, (api) =>
      api
        .get(`/projects/${projectSummaryRenamed.project.projectId}/summary`)
        .reply(StatusCodes.OK, projectSummaryRenamed),
    )
    .stdout()
    .command([
      'rename project',
      projectSummary.project.projectId,
      '-n',
      `${projectSummaryRenamed.project.name}`,
    ])
    .it('runs rename project with a specific project-id and new name', (ctx) => {
      expect(ctx.stdout).to.contain(projectSummaryRenamed.project.name)
      expect(ctx.stdout).to.contain([projectSummaryRenamed.project.projectId])
      expect(ctx.stdout).to.contain(projectSummaryRenamed.apiKey.apiKeyName)
    })
  describe('renaming a project and server is down', () => {
    test
      .nock(`${IAM_URL}`, (api) =>
        api
          .patch(`/projects/${projectSummary.project.projectId}`)
          .reply(StatusCodes.INTERNAL_SERVER_ERROR),
      )
      .stdout()
      .command([
        'rename project',
        projectSummary.project.projectId,
        '-n',
        `${projectSummaryRenamed.project.name}`,
      ])
      .it('runs rename project while the service is down', (ctx) => {
        expect(ctx.stdout).to.contain(ServiceDownError)
      })
  })
  describe('Renaming a project while not authorized', () => {
    before(() => {
      vaultService.clear()
    })
    test
      .stdout()
      .command(['rename project', projectSummaryRenamed.project.projectId])
      .it('runs rename project while user is unauthorized', (ctx) => {
        expect(ctx.stdout).to.contain(Unauthorized)
      })
  })
})
