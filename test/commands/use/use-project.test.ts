import { expect, test } from '@oclif/test'
import { StatusCodes } from 'http-status-codes'

import { IAM_URL } from '../../../src/services/iam'
import { projectSummary } from '../../../src/fixtures/mock-projects'
import { ServiceDownError, Unauthorized } from '../../../src/errors'
import { ANALYTICS_URL } from '../../../src/services/analytics'

describe('project', () => {
  test
    .nock(`${IAM_URL}`, (api) =>
      api
        .get(`/projects/${projectSummary.project.projectId}/summary`)
        .reply(StatusCodes.OK, projectSummary),
    )
    .nock(`${ANALYTICS_URL}`, (api) => api.post('/api/events').reply(StatusCodes.CREATED))
    .stdout()
    .command(['use project', projectSummary.project.projectId])
    .it('runs use project with a specific project-id', (ctx) => {
      expect(ctx.stdout).to.contain('"name": "Awesome project"')
      expect(ctx.stdout).to.contain('"projectId": "some-project1-id"')
      expect(ctx.stdout).to.contain('"apiKeyHash": "********************"')
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
