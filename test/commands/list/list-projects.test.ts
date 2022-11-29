import { expect, test } from '@oclif/test'
import { StatusCodes } from 'http-status-codes'

import { ANALYTICS_URL } from '../../../src/services/analytics'
import { projectList } from '../../../src/fixtures/mock-projects'
import * as authentication from '../../../src/middleware/authentication'
import { IAM_URL } from '../../../src/services/iam'

describe('projects', () => {
  test
    .nock(`${IAM_URL}`, (api) => api.get('/projects').reply(StatusCodes.OK, projectList))
    .nock(`${ANALYTICS_URL}`, (api) => api.post('/api/events').reply(StatusCodes.CREATED))
    .stdout()
    .stub(authentication, 'isAuthenticated', () => true)
    .command(['list projects'])
    .it('it runs list projects with default values for all flags', (ctx) => {
      expect(ctx.stdout).to.contain('"name": "Awesome project",')
      expect(ctx.stdout).to.contain('"projectId": "some-project1-id",')
      expect(ctx.stdout).to.contain('"createdAt": "2022-09-06T20:31:20.467Z"')
      expect(ctx.stdout).to.contain('"name": "Awesome project 2",')
      expect(ctx.stdout).to.contain('"name": "Awesome project 3",')
    })
  describe('list projects with skip flag set', () => {
    test
      .nock(`${IAM_URL}`, (api) => api.get('/projects').reply(StatusCodes.OK, projectList))
      .nock(`${ANALYTICS_URL}`, (api) => api.post('/api/events').reply(StatusCodes.CREATED))
      .stdout()
      .stub(authentication, 'isAuthenticated', () => true)
      .command(['list projects', '--skip=1'])
      .it('it runs list projects with skip flag = 1', (ctx) => {
        expect(ctx.stdout).to.not.contain('"name": "Awesome project",')
        expect(ctx.stdout).to.not.contain('"projectId": "some-project1-id",')
        expect(ctx.stdout).to.contain('"name": "Awesome project 2",')
        expect(ctx.stdout).to.contain('"projectId": "some-project2-id",')
        expect(ctx.stdout).to.contain('"name": "Awesome project 3",')
        expect(ctx.stdout).to.contain('"projectId": "some-project3-id",')
      })
  })
  describe('list projects with skip and limit flag set', () => {
    test
      .nock(`${IAM_URL}`, (api) => api.get('/projects').reply(StatusCodes.OK, projectList))
      .nock(`${ANALYTICS_URL}`, (api) => api.post('/api/events').reply(StatusCodes.CREATED))
      .stdout()
      .stub(authentication, 'isAuthenticated', () => true)
      .command(['list projects', '--skip=1', '--limit=1'])
      .it('it runs list projects with skip=1 limit=1', (ctx) => {
        expect(ctx.stdout).to.not.contain('"name": "Awesome project",')
        expect(ctx.stdout).to.not.contain('"projectId": "some-project1-id",')
        expect(ctx.stdout).to.contain('"name": "Awesome project 2",')
        expect(ctx.stdout).to.contain('"projectId": "some-project2-id",')
        expect(ctx.stdout).to.not.contain('"name": "Awesome project 3",')
        expect(ctx.stdout).to.not.contain('"projectId": "some-project3-id",')
      })
  })
  describe('list projects output flag set to table format', () => {
    test
      .nock(`${IAM_URL}`, (api) => api.get('/projects').reply(StatusCodes.OK, projectList))
      .nock(`${ANALYTICS_URL}`, (api) => api.post('/api/events').reply(StatusCodes.CREATED))
      .stdout()
      .stub(authentication, 'isAuthenticated', () => true)
      .command(['list projects', '--output=table'])
      .it('it runs list projects with output=table', (ctx) => {
        expect(ctx.stdout).to.contain('some-project1-id Awesome project   2022-09-06T20:31:20.467Z')
      })
  })
})
