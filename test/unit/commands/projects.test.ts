import { expect, test } from '@oclif/test'
import { configService } from '../../../src/services'
import { clientSDK } from '../../../src/services/affinidi'
import { IAM_URL } from '../../../src/services/urls'

const testUserId = '38efcc70-bbe1-457a-a6c7-b29ad9913648'

describe('project: commands', function () {
  describe('create-project', function () {
    beforeEach(function () {
      configService.create(testUserId)
    })
    afterEach(function () {
      configService.clear()
      clientSDK.config.clear()
    })
    test
      .stdout()
      .command(['project create-project'])
      .exit(2)
      .it('Throws error when no project name flag provided.', (ctx) => {
        expect(ctx.stdout).to.equal('')
      })

    test
      .nock(IAM_URL, (api) =>
        api
          .post('/v1/projects')
          // user is logged in, return their name
          .reply(200, { data: { id: '1234', name: 'my-project-name' } }),
      )
      .stdout()
      .command(['project create-project', '--name=my-project-name'])
      .it('Creates project with the given name using --name flag.', (ctx) => {
        expect(ctx.stdout).to.contain('"name": "my-project-name"')
      })

    test
      .nock(IAM_URL, (api) =>
        api
          .post('/v1/projects')
          // user is logged in, return their name
          .reply(200, { data: { id: '1234', name: 'my-project-name' } }),
      )
      .stdout()
      .command(['project create-project', '-n=my-project-name'])
      .it('Creates project with the given name using -n flag.', (ctx) => {
        expect(ctx.stdout).to.contain('"name": "my-project-name"')
      })
  })

  describe('list-projects', function () {
    beforeEach(function () {
      configService.create(testUserId)
    })
    afterEach(function () {
      configService.clear()
      clientSDK.config.clear()
    })

    test
      .nock(IAM_URL, (api) =>
        api
          .get('/v1/projects')
          // user is logged in, return their name
          .reply(200, { projects: [{ id: '1234', name: 'my-project-name' }] }),
      )
      .stdout()
      .command(['project list-projects'])
      .it('Should return list of projects', (ctx) => {
        expect(ctx.stdout).to.contain('"name": "my-project-name"')
      })
  })

  describe('select-project', function () {
    beforeEach(function () {
      configService.create(testUserId)
    })
    afterEach(function () {
      configService.clear()
      clientSDK.config.clear()
    })

    test
      .nock(IAM_URL, (api) =>
        api
          .get('/v1/projects')
          // user is logged in, return their name
          .reply(200, { projects: [{ id: '1234', name: 'my-project-name' }] }),
      )
      .stdout()
      .command(['project select-project'])
      .it('Does nothing when user has a single project.', (ctx) => {
        expect(ctx.stdout).to.contain('You have a single project')
      })
  })
})
