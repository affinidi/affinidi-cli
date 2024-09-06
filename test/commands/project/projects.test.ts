import { runCommand } from '@oclif/test'
import { expect } from 'chai'
import nock from 'nock'
import { config } from '../../../src/services/env-config.js'

describe('project: commands', function () {
  describe('create-project', function () {
    it('Creates project with the given name using --name flag.', async () => {
      nock(config.bffHost)
        .post('/api/project')
        .reply(200, { data: { id: '1234', name: 'my-project-name' } })
      const { stdout } = await runCommand(['project create-project', '--name=my-project-name'])
      expect(stdout).to.contain('"name": "my-project-name"')
    })

    it('Creates project with the given name using -n flag.', async () => {
      nock(config.bffHost)
        .post('/api/project')
        .reply(200, { data: { id: '1234', name: 'my-project-name' } })
      const { stdout } = await runCommand(['project create-project', '-n=my-project-name'])
      expect(stdout).to.contain('"name": "my-project-name"')
    })
  })

  describe('list-projects', function () {
    it('Should return list of projects', async () => {
      nock(config.bffHost)
        .get('/api/projects')
        .reply(200, { projects: [{ id: '1234', name: 'my-project-name' }] })
      const { stdout } = await runCommand(['project list-projects'])
      expect(stdout).to.contain('"name": "my-project-name"')
    })
  })

  describe('select-project', function () {
    it('Does nothing when user has a single project.', async () => {
      nock(config.bffHost)
        .get('/api/projects')
        .reply(200, [{ id: '1234', name: 'my-project-name' }])
      const { stdout } = await runCommand(['project select-project'])
      expect(stdout).to.contain('You have a single project')
    })
  })
})
