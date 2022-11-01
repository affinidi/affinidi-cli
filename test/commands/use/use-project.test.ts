import { expect, test } from '@oclif/test'
import { StatusCodes } from 'http-status-codes'

import { IAM_URL } from '../../../src/services/iam'
import { projectSummary } from '../../../src/fixtures/mock-projects'
import { ServiceDownError, Unauthorized } from '../../../src/errors'

describe('project', () => {
  test
    .nock(`${IAM_URL}`, (api) =>
      api
        .get(`/projects/${projectSummary.project.projectId}/summary`)
        .reply(StatusCodes.OK, projectSummary),
    )
    .stdout()
    .command(['use project', projectSummary.project.projectId])
    .it('runs use project with a specific project-id', (ctx) => {
      expect(ctx.stdout).to.contain('"name": "Awesome project"')
      expect(ctx.stdout).to.contain('"projectId": "some-project1-id"')
      expect(ctx.stdout).to.contain('"apiKeyHash": "Awesome-API-Key-Hash"')
    })
  describe('Activating a project while not authorized', () => {
    test
      .nock(`${IAM_URL}`, (api) =>
        api
          .get(`/projects/${projectSummary.project.projectId}/summary`)
          .replyWithError(Unauthorized),
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
          .replyWithError(ServiceDownError),
      )
      .stdout()
      .command(['use project', projectSummary.project.projectId])
      .it('runs use project while the service is down', (ctx) => {
        expect(ctx.stdout).to.contain(ServiceDownError)
      })
  })
})
