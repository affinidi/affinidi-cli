import { runCommand } from '@oclif/test'
import { expect } from 'chai'
import nock from 'nock'
import { config } from '../../../src/services/env-config.js'

const VP_ADAPTER_URL = `${config.bffHost}/vpa`

const data = {
  newGroupName: 'new-group-name',
  invalidGroupName: 'group name',
  nonExistentGroupName: '12345',
}

describe('login: group management commands', function () {
  describe('login:create-group', () => {
    it('outputs the created user group info', async () => {
      nock(VP_ADAPTER_URL).post('/v1/groups').reply(200, {
        ari: 'ari:identity:ap-southeast-1:1afac523-9ed4-4b72-af29-16c376b5a32a:group/new-group-name',
        groupName: 'new-group-name',
        projectId: '1afac523-9ed4-4b72-af29-16c376b5a32a',
        creationDate: '2023-09-22T04:53:56.227Z',
      })
      const { stdout } = await runCommand(['login:create-group', `--name=${data.newGroupName}`])
      const response = JSON.parse(stdout)
      expect(response).to.have.a.property('ari')
      expect(response).to.have.a.property('groupName')
      expect(response).to.have.a.property('projectId')
      expect(response).to.have.a.property('creationDate')
    })
  })

  describe('login:get-group', () => {
    it('outputs the user group info', async () => {
      nock(VP_ADAPTER_URL).get(`/v1/groups/${data.newGroupName}`).reply(200, {
        ari: 'ari:identity:ap-southeast-1:1afac523-9ed4-4b72-af29-16c376b5a32a:group/new-group-name',
        groupName: 'new-group-name',
        projectId: '1afac523-9ed4-4b72-af29-16c376b5a32a',
        creationDate: '2023-09-22T04:53:56.227Z',
      })
      const { stdout } = await runCommand(['login:get-group', `--name=${data.newGroupName}`])
      const response = JSON.parse(stdout)
      expect(response).to.have.a.property('ari')
      expect(response).to.have.a.property('groupName')
      expect(response).to.have.a.property('projectId')
      expect(response).to.have.a.property('creationDate')
    })
  })

  describe('login:list-groups', () => {
    it('outputs the list of user groups', async () => {
      nock(VP_ADAPTER_URL)
        .get(`/v1/groups`)
        .reply(200, {
          groups: [
            {
              ari: 'ari:identity:ap-southeast-1:1afac523-9ed4-4b72-af29-16c376b5a32a:group/new-group-name',
              groupName: 'new-group-name',
              projectId: '1afac523-9ed4-4b72-af29-16c376b5a32a',
              creationDate: '2023-09-22T04:53:56.227Z',
            },
          ],
        })
      const { stdout } = await runCommand(['login:list-groups'])
      const response = JSON.parse(stdout)
      expect(response).to.have.a.property('groups')
      expect(response.groups[0]).to.have.a.property('ari')
      expect(response.groups[0]).to.have.a.property('groupName')
      expect(response.groups[0]).to.have.a.property('projectId')
      expect(response.groups[0]).to.have.a.property('creationDate')
    })
  })

  describe('login:delete-group', () => {
    it('deletes the mentioned user group', async () => {
      nock(VP_ADAPTER_URL).delete(`/v1/groups/${data.newGroupName}`).reply(200)
      const { stdout } = await runCommand(['login:delete-group', `--name=${data.newGroupName}`])
      const response = JSON.parse(stdout)
      expect(response).to.have.a.property('name')
    })
  })
})
