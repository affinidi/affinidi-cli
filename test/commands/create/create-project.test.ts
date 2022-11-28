import { CliUx } from '@oclif/core'
import { expect, test } from '@oclif/test'
import { StatusCodes } from 'http-status-codes'
import { ANALYTICS_URL } from '../../../src/services/analytics'

import { ServiceDownError, Unauthorized } from '../../../src/errors'
import { projectSummary } from '../../../src/fixtures/mock-projects'
import { IAM_URL } from '../../../src/services/iam'
import * as prompts from '../../../src/user-actions'
import * as authentication from '../../../src/middleware/authentication'

const doNothing = () => {}

describe('create project command', () => {
  test
    .nock(`${IAM_URL}`, (api) =>
      api.post('/projects').reply(StatusCodes.OK, {
        projectId: projectSummary.project.projectId,
        name: projectSummary.project.name,
        createdAt: projectSummary.project.createdAt,
      }),
    )
    .nock(`${IAM_URL}`, (api) =>
      api.get(`/projects/${projectSummary.project.projectId}/summary`).reply(StatusCodes.OK, {
        wallet: {
          didUrl: projectSummary.wallet.didUrl,
          did: projectSummary.wallet.did,
        },
        apiKey: {
          apiKeyHash: projectSummary.apiKey.apiKeyHash,
          apiKeyName: projectSummary.apiKey.apiKeyName,
        },
        project: {
          projectId: projectSummary.project.projectId,
          name: projectSummary.project.name,
          createdAt: projectSummary.project.createdAt,
        },
      }),
    )
    .nock(`${ANALYTICS_URL}`, (api) => api.post('/api/events').reply(StatusCodes.CREATED))
    .stdout()
    .stub(authentication, 'isAuthenticated', () => true)
    .stub(prompts, 'projectNamePrompt', () => async () => projectSummary.project.name)
    .stub(CliUx.ux.action, 'start', () => () => doNothing)
    .stub(CliUx.ux.action, 'stop', () => doNothing)
    .command(['create project'])
    .it('runs create project with a project name', (ctx) => {
      expect(ctx.stdout).to.contain(projectSummary.project.name)
    })

  describe('Internal server error', () => {
    test
      .nock(`${IAM_URL}`, (api) => api.post('/projects').reply(StatusCodes.INTERNAL_SERVER_ERROR))
      .stdout()
      .stub(authentication, 'isAuthenticated', () => true)
      .stub(prompts, 'projectNamePrompt', () => async () => projectSummary.project.name)
      .stub(CliUx.ux.action, 'start', () => () => doNothing)
      .stub(CliUx.ux.action, 'stop', () => doNothing)
      .command(['create project'])
      .it('runs create project command but the service is down', (ctx) => {
        expect(ctx.stdout).to.contain(ServiceDownError)
      })
  })

  describe('User is unauthorized', () => {
    test
      .stdout()
      .stub(prompts, 'projectNamePrompt', () => async () => projectSummary.project.name)
      .stub(CliUx.ux.action, 'start', () => () => doNothing)
      .stub(CliUx.ux.action, 'stop', () => doNothing)
      .command(['create project'])
      .it('runs create project command but the user is unauthorized to use this service', (ctx) => {
        expect(ctx.stdout).to.contain(Unauthorized)
      })
  })
})
