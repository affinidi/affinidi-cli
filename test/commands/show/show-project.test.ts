import { expect, test } from '@oclif/test'
import { StatusCodes } from 'http-status-codes'
import { CliUx } from '@oclif/core'

import { IAM_URL } from '../../../src/services/iam'
import { projectSummary } from '../../../src/fixtures/mock-projects'
import { ServiceDownError, Unauthorized } from '../../../src/errors'
import { vaultService, VAULT_KEYS } from '../../../src/services'
import { ANALYTICS_URL } from '../../../src/services/analytics'
import * as authentication from '../../../src/middleware/authentication'

const doNothing = () => {}
describe('project', () => {
  test
    .nock(`${IAM_URL}`, (api) =>
      api
        .get(`/projects/${projectSummary.project.projectId}/summary`)
        .reply(StatusCodes.OK, projectSummary),
    )
    .nock(`${ANALYTICS_URL}`, (api) => api.post('/api/events').reply(StatusCodes.CREATED))
    .stub(CliUx.ux.action, 'start', () => () => doNothing)
    .stub(CliUx.ux.action, 'stop', () => doNothing)
    .stdout()
    .stub(authentication, 'isAuthenticated', () => true)
    .command(['show project', projectSummary.project.projectId])
    .it('runs show project with a specific project-id', (ctx) => {
      expect(ctx.stdout).to.contain('"name": "Awesome project"')
      expect(ctx.stdout).to.contain('"projectId": "some-project1-id"')
      expect(ctx.stdout).to.contain('"apiKeyHash": "********************"')
    })
  describe('Showing active project', () => {
    before(() => {
      vaultService.set(VAULT_KEYS.projectId, projectSummary.project.projectId)
    })
    after(() => {
      vaultService.clear()
    })
    test
      .nock(`${IAM_URL}`, (api) =>
        api
          .get(`/projects/${projectSummary.project.projectId}/summary`)
          .reply(StatusCodes.OK, projectSummary),
      )
      .nock(`${ANALYTICS_URL}`, (api) => api.post('/api/events').reply(StatusCodes.CREATED))
      .stub(authentication, 'isAuthenticated', () => true)
      .stub(CliUx.ux.action, 'start', () => () => doNothing)
      .stub(CliUx.ux.action, 'stop', () => doNothing)
      .stdout()
      .stub(authentication, 'isAuthenticated', () => true)
      .command(['show project', '--active'])
      .it('runs show project with active project', (ctx) => {
        expect(ctx.stdout).to.contain('"name": "Awesome project"')
        expect(ctx.stdout).to.contain('"projectId": "some-project1-id"')
        expect(ctx.stdout).to.contain('"apiKeyHash": "********************"')
      })
  })
  describe('Showing a project while not authorized', () => {
    test
      .stub(CliUx.ux.action, 'start', () => () => doNothing)
      .stub(CliUx.ux.action, 'stop', () => doNothing)
      .stdout()
      .command(['show project', projectSummary.project.projectId])
      .it('runs show project while user is unauthorized', (ctx) => {
        expect(ctx.stdout).to.contain(Unauthorized)
      })
  })
  describe('Showing a project and server is down', () => {
    test
      .nock(`${IAM_URL}`, (api) =>
        api
          .get(`/projects/${projectSummary.project.projectId}/summary`)
          .reply(StatusCodes.INTERNAL_SERVER_ERROR),
      )
      .stub(authentication, 'isAuthenticated', () => true)
      .stub(CliUx.ux.action, 'start', () => () => doNothing)
      .stub(CliUx.ux.action, 'stop', () => doNothing)
      .stdout()
      .command(['show project', projectSummary.project.projectId])
      .it('runs show project while the service is down', (ctx) => {
        expect(ctx.stdout).to.contain(ServiceDownError)
      })
  })
})
