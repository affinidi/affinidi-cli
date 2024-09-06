import { runCommand } from '@oclif/test'
import { expect } from 'chai'
import nock from 'nock'
import { config } from '../../../src/services/env-config.js'

const VP_ADAPTER_URL = `${config.bffHost}/vpa`

const data = {
  existingGroupName: 'existing-group-name',
  newUserId: 'did:key:12345',
}

describe('login: group users commands', function () {
  describe('login:add-user-to-group', () => {
    it('outputs the user and group info', async () => {
      nock(VP_ADAPTER_URL).post(`/v1/groups/${data.existingGroupName}/users`).reply(200, {
        userId: 'did:key:12345',
        addedAt: '2023-09-22T06:20:56.372Z',
      })
      const { stdout } = await runCommand([
        'login:add-user-to-group',
        `--group-name=${data.existingGroupName}`,
        `--user-id=${data.newUserId}`,
      ])
      const response = JSON.parse(stdout)
      expect(response).to.have.a.property('userId')
      expect(response).to.have.a.property('addedAt')
    })
  })

  describe('login:list-users-in-group', () => {
    it('outputs the user and group info', async () => {
      nock(VP_ADAPTER_URL)
        .get(`/v1/groups/${data.existingGroupName}/users?limit=15`)
        .reply(200, {
          users: [
            {
              userId: 'did:key:12345',
              addedAt: '2023-09-22T06:20:56.372Z',
            },
          ],
          totalUserCount: 1,
        })
      const { stdout } = await runCommand(['login:list-users-in-group', `--group-name=${data.existingGroupName}`])
      const response = JSON.parse(stdout)
      expect(response).to.have.a.property('users')
      expect(response.users[0]).to.have.a.property('userId')
      expect(response.users[0]).to.have.a.property('addedAt')
      expect(response).to.have.a.property('totalUserCount')
    })
  })

  describe('login:remove-user-from-group', () => {
    it('outputs the user and group info', async () => {
      nock(VP_ADAPTER_URL).delete(`/v1/groups/${data.existingGroupName}/users`).reply(200, {
        userId: data.newUserId,
      })
      const { stdout } = await runCommand([
        'login:remove-user-from-group',
        `--group-name=${data.existingGroupName}`,
        `--user-id=${data.newUserId}`,
      ])
      const response = JSON.parse(stdout)
      expect(response).to.have.a.property('groupName')
      expect(response).to.have.a.property('userId')
    })
  })
})
