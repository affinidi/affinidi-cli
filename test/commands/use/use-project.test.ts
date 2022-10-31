import { expect, test } from '@oclif/test'
import { StatusCodes } from 'http-status-codes'

import { IAM_URL } from '../../../src/services/iam'
import { projectSummary } from '../../../src/fixtures/mock-projects'
import { ServiceDownError, Unauthorized } from '../../../src/errors'

describe('project', () => {
  test
    .nock(`${IAM_URL}`, (api) =>
      api
        .get('/projects/925b8891-dba0-4e8a-a379-3686d165a8a1/summary')
        .reply(StatusCodes.OK, projectSummary),
    )
    .stdout()
    .command(['use project', projectSummary.project.projectId])
    .it('runs use project with a specific project-id', (ctx) => {
      expect(ctx.stdout).to.contain('"name": "Awesome project"')
      expect(ctx.stdout).to.contain('"projectId": "925b8891-dba0-4e8a-a379-3686d165a8a1"')
      expect(ctx.stdout).to.contain(
        '"apiKeyHash": "dc4ed2b27cd0d840d51c6dae6460f571824cc72f4ded47f7225dbff65bcea4bf"',
      )
    })
  describe('Activating a project while not authorized', () => {
    test
      .nock(`${IAM_URL}`, (api) =>
        api
          .get('/projects/925b8891-dba0-4e8a-a379-3686d165a8a1/summary')
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
          .get('/projects/925b8891-dba0-4e8a-a379-3686d165a8a1/summary')
          .replyWithError(ServiceDownError),
      )
      .stdout()
      .command(['use project', projectSummary.project.projectId])
      .it('runs use project while the service is down', (ctx) => {
        expect(ctx.stdout).to.contain(ServiceDownError)
      })
  })
})
