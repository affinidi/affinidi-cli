import { CliUx } from '@oclif/core'
import { expect, test } from '@oclif/test'
import { StatusCodes } from 'http-status-codes'
import { ServiceDownError, Unauthorized } from '../../../../src/errors'
import { IAM_URL } from '../../../../src/services/iam'
import * as prompts from '../../../../src/user-actions'

const testProjectName = 'New Project'
const doNothing = () => {}

describe('create project command', () => {
  test
    .nock(`${IAM_URL}`, (api) =>
      api.post('/projects').reply(StatusCodes.OK, {
        projectId: 'some-project-id',
        name: 'some project',
        createdAt: '2022-10-27T07:26:43.747Z',
      }),
    )
    .nock(`${IAM_URL}`, (api) =>
      api.get('/projects/some-project-id/summary').reply(StatusCodes.OK, {
        wallet: {
          didUrl: 'some-did-url',
          did: 'some-did',
        },
        apiKey: {
          apiKeyHash: 'some-API-key-hashed',
          apiKeyName: 'some-API-key-name',
        },
        project: {
          projectId: 'some-project-id',
          name: testProjectName,
          createdAt: '2022-10-27T07:56:26.923Z',
        },
      }),
    )
    .stdout()
    .stub(prompts, 'projectNamePrompt', () => async () => testProjectName)
    .stub(CliUx.ux.action, 'start', () => () => doNothing)
    .stub(CliUx.ux.action, 'stop', () => doNothing)
    .command(['create project'])
    .it('runs create project with a project name', (ctx) => {
      expect(ctx.stdout).to.contain(testProjectName)
    })

  describe('Internal server error', () => {
    test
      .nock(`${IAM_URL}`, (api) => api.post('/projects').reply(StatusCodes.INTERNAL_SERVER_ERROR))
      .stdout()
      .stub(prompts, 'projectNamePrompt', () => async () => testProjectName)
      .stub(CliUx.ux.action, 'start', () => () => doNothing)
      .stub(CliUx.ux.action, 'stop', () => doNothing)
      .command(['create project'])
      .it('runs create project command but the service is down', (ctx) => {
        expect(ctx.stdout).to.contain(ServiceDownError)
      })
  })

  describe('User is unauthorized', () => {
    test
      .nock(`${IAM_URL}`, (api) => api.post('/projects').reply(StatusCodes.UNAUTHORIZED))
      .stdout()
      .stub(prompts, 'projectNamePrompt', () => async () => testProjectName)
      .stub(CliUx.ux.action, 'start', () => () => doNothing)
      .stub(CliUx.ux.action, 'stop', () => doNothing)
      .command(['create project'])
      .it('runs create project command but the user is unauthorized to use this service', (ctx) => {
        expect(ctx.stdout).to.contain(Unauthorized)
      })
  })
})
