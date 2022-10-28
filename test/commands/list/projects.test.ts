import { expect, test } from '@oclif/test'
import { StatusCodes } from 'http-status-codes'

import { IAM_URL } from '../../../src/services/iam'
const projectList = {
  projects: [
    {
      name: 'Awesome project',
      projectId: '925b8891-dba0-4e8a-a379-3686d165a8a1',
      createdAt: '2022-09-06T20:31:20.467Z',
    },
    {
      name: 'Awesome project 2',
      projectId: '925b8891-dba0-4e8a-a379-3686d165a8a2',
      createdAt: '2022-09-06T20:31:20.467Z',
    },
    {
      name: 'Awesome project 3',
      projectId: '925b8891-dba0-4e8a-a379-3686d165a8a3',
      createdAt: '2022-09-06T20:31:20.467Z',
    },
  ],
}

describe('projects', () => {
  test
    .nock(`${IAM_URL}`, (api) => api.get('/projects').reply(StatusCodes.OK, projectList))
    .stdout()
    .command(['list projects'])
    .it('it runs list projects with default values for all flags', (ctx) => {
      expect(ctx.stdout).to.contain('"name": "Awesome project",')
      expect(ctx.stdout).to.contain('"projectId": "925b8891-dba0-4e8a-a379-3686d165a8a1",')
      expect(ctx.stdout).to.contain('"createdAt": "2022-09-06T20:31:20.467Z"')
      expect(ctx.stdout).to.contain('"name": "Awesome project 2",')
      expect(ctx.stdout).to.contain('"name": "Awesome project 3",')
    })
  describe('list projects with skip flag set', () => {
    test
      .nock(`${IAM_URL}`, (api) => api.get('/projects').reply(StatusCodes.OK, projectList))
      .stdout()
      .command(['list projects', '--skip=1'])
      .it('it runs list projects with skip flag = 1', (ctx) => {
        expect(ctx.stdout).to.not.contain('"name": "Awesome project",')
        expect(ctx.stdout).to.not.contain('"projectId": "925b8891-dba0-4e8a-a379-3686d165a8a1",')
        expect(ctx.stdout).to.contain('"name": "Awesome project 2",')
        expect(ctx.stdout).to.contain('"projectId": "925b8891-dba0-4e8a-a379-3686d165a8a2",')
        expect(ctx.stdout).to.contain('"name": "Awesome project 3",')
        expect(ctx.stdout).to.contain('"projectId": "925b8891-dba0-4e8a-a379-3686d165a8a3",')
      })
  })
  describe('list projects with skip and limit flag set', () => {
    test
      .nock(`${IAM_URL}`, (api) => api.get('/projects').reply(StatusCodes.OK, projectList))
      .stdout()
      .command(['list projects', '--skip=1', '--limit=1'])
      .it('it runs list projects with skip=1 limit=1', (ctx) => {
        expect(ctx.stdout).to.not.contain('"name": "Awesome project",')
        expect(ctx.stdout).to.not.contain('"projectId": "925b8891-dba0-4e8a-a379-3686d165a8a1",')
        expect(ctx.stdout).to.contain('"name": "Awesome project 2",')
        expect(ctx.stdout).to.contain('"projectId": "925b8891-dba0-4e8a-a379-3686d165a8a2",')
        expect(ctx.stdout).to.not.contain('"name": "Awesome project 3",')
        expect(ctx.stdout).to.not.contain('"projectId": "925b8891-dba0-4e8a-a379-3686d165a8a3",')
      })
  })
  describe('list projects output flag set to table format', () => {
    test
      .nock(`${IAM_URL}`, (api) => api.get('/projects').reply(StatusCodes.OK, projectList))
      .stdout()
      .command(['list projects', '--output=table'])
      .it('it runs list projects with output=table', (ctx) => {
        expect(ctx.stdout).to.contain(
          '925b8891-dba0-4e8a-a379-3686d165a8a1 Awesome project   2022-09-06T20:31:20.467Z',
        )
      })
  })
})
