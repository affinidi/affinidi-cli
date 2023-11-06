import { expect, test } from '@oclif/test'
import { config } from '../../../src/services/env-config'

describe('project: commands', function () {
  describe('create-project', function () {
    test
      .nock(config.bffHost, (api) =>
        api.post('/api/project').reply(200, { data: { id: '1234', name: 'my-project-name' } }),
      )
      .stdout()
      .command(['project create-project', '--name=my-project-name'])
      .it('Creates project with the given name using --name flag.', (ctx) => {
        expect(ctx.stdout).to.contain('"name": "my-project-name"')
      })

    test
      .nock(config.bffHost, (api) =>
        api.post('/api/project').reply(200, { data: { id: '1234', name: 'my-project-name' } }),
      )
      .stdout()
      .command(['project create-project', '-n=my-project-name'])
      .it('Creates project with the given name using -n flag.', (ctx) => {
        expect(ctx.stdout).to.contain('"name": "my-project-name"')
      })
  })

  describe('list-projects', function () {
    test
      .nock(config.bffHost, (api) =>
        api.get('/api/projects').reply(200, { projects: [{ id: '1234', name: 'my-project-name' }] }),
      )
      .stdout()
      .command(['project list-projects'])
      .it('Should return list of projects', (ctx) => {
        expect(ctx.stdout).to.contain('"name": "my-project-name"')
      })
  })

  describe('select-project', function () {
    test
      .nock(config.bffHost, (api) => api.get('/api/projects').reply(200, [{ id: '1234', name: 'my-project-name' }]))
      .stdout()
      .command(['project select-project'])
      .it('Does nothing when user has a single project.', (ctx) => {
        expect(ctx.stdout).to.contain('You have a single project')
      })
  })
})
