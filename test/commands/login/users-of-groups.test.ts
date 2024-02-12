import { expect, test } from '@oclif/test'
import { config } from '../../../src/services/env-config'

const VP_ADAPTER_URL = `${config.bffHost}/vpa`

const data = {
  existingGroupName: 'existing-group-name',
  newUserId: 'did:key:12345',
}

describe('login: group users commands', function () {
  describe('login:add-user-to-group', () => {
    const validArgs = [
      'login:add-user-to-group',
      `--group-name=${data.existingGroupName}`,
      `--user-id=${data.newUserId}`,
    ]

    test
      .nock(VP_ADAPTER_URL, (api) =>
        api.post(`/v1/groups/${data.existingGroupName}/users`).reply(200, {
          userId: 'did:key:12345',
          addedAt: '2023-09-22T06:20:56.372Z',
        }),
      )
      .stdout()
      .command(validArgs)
      .it('outputs the user and group info', async (ctx) => {
        const response = JSON.parse(ctx.stdout)
        expect(response).to.have.a.property('userId')
        expect(response).to.have.a.property('addedAt')
      })
  })

  describe('login:list-users-in-group', () => {
    const validArgs = ['login:list-users-in-group', `--group-name=${data.existingGroupName}`]

    test
      .nock(VP_ADAPTER_URL, (api) =>
        api.get(`/v1/groups/${data.existingGroupName}/users?limit=20`).reply(200, {
          users: [
            {
              userId: 'did:key:12345',
              addedAt: '2023-09-22T06:20:56.372Z',
            },
          ],
          totalUserCount: 1,
        }),
      )
      .stdout()
      .command(validArgs)
      .it('outputs the user and group info', async (ctx) => {
        const response = JSON.parse(ctx.stdout)
        expect(response).to.have.a.property('users')
        expect(response.users[0]).to.have.a.property('userId')
        expect(response.users[0]).to.have.a.property('addedAt')
        expect(response).to.have.a.property('totalUserCount')
      })
  })

  describe('login:remove-user-from-group', () => {
    const validArgs = [
      'login:remove-user-from-group',
      `--group-name=${data.existingGroupName}`,
      `--user-id=${data.newUserId}`,
    ]

    test
      .nock(VP_ADAPTER_URL, (api) =>
        api.delete(`/v1/groups/${data.existingGroupName}/users`).reply(200, {
          userId: data.newUserId,
        }),
      )
      .stdout()
      .command(validArgs)
      .it('outputs the user and group info', async (ctx) => {
        const response = JSON.parse(ctx.stdout)
        expect(response).to.have.a.property('groupName')
        expect(response).to.have.a.property('userId')
      })
  })
})
