import { expect, test } from '@oclif/test'
import { config } from '../../../src/services/env-config'

const VP_ADAPTER_URL = `${config.bffHost}/vpa`

const data = {
  existingGroupName: 'existing-group-name',
  newUserSub: 'did:key:12345',
  userGroupMappingId: 'bbbfb63cfa8d17a01b8e9ef491caf049a162c5a41b5d322835f9f6ff9dfce6f2',
}

describe('login: group users commands', function () {
  describe('login:add-user-to-group', () => {
    const validArgs = [
      'login:add-user-to-group',
      `--group-name=${data.existingGroupName}`,
      `--user-sub=${data.newUserSub}`,
    ]

    test
      .nock(VP_ADAPTER_URL, (api) =>
        api.post(`/v1/groups/${data.existingGroupName}/users`).reply(200, {
          ari: 'ari:identity:ap-southeast-1:1afac523-9ed4-4b72-af29-16c376b5a32a:group/existing-group-name/user/85556da4ac2238ceb4ab0355aaa36fb7a5eb7459fade25f7d96b8f3a6e1c1023',
          projectId: '1afac523-9ed4-4b72-af29-16c376b5a32a',
          groupName: 'existing-group-name',
          sub: 'did:key:12345',
          id: '85556da4ac2238ceb4ab0355aaa36fb7a5eb7459fade25f7d96b8f3a6e1c1023',
          creationDate: '2023-09-22T06:20:56.372Z',
        }),
      )
      .stdout()
      .command(validArgs)
      .it('outputs the user and group info', async (ctx) => {
        const response = JSON.parse(ctx.stdout)
        expect(response).to.have.a.property('ari')
        expect(response).to.have.a.property('groupName')
        expect(response).to.have.a.property('sub')
        expect(response).to.have.a.property('id')
        expect(response).to.have.a.property('projectId')
        expect(response).to.have.a.property('creationDate')
      })
  })

  describe('login:list-users-in-group', () => {
    const validArgs = ['login:list-users-in-group', `--group-name=${data.existingGroupName}`]

    test
      .nock(VP_ADAPTER_URL, (api) =>
        api.get(`/v1/groups/${data.existingGroupName}/users`).reply(200, {
          users: [
            {
              ari: 'ari:identity:ap-southeast-1:1afac523-9ed4-4b72-af29-16c376b5a32a:group/existing-group-name/user/85556da4ac2238ceb4ab0355aaa36fb7a5eb7459fade25f7d96b8f3a6e1c1023',
              projectId: '1afac523-9ed4-4b72-af29-16c376b5a32a',
              groupName: 'existing-group-name',
              sub: 'did:key:12345',
              id: '85556da4ac2238ceb4ab0355aaa36fb7a5eb7459fade25f7d96b8f3a6e1c1023',
              creationDate: '2023-09-22T06:20:56.372Z',
            },
          ],
        }),
      )
      .stdout()
      .command(validArgs)
      .it('outputs the user and group info', async (ctx) => {
        const response = JSON.parse(ctx.stdout)
        expect(response).to.have.a.property('users')
        expect(response.users[0]).to.have.a.property('ari')
        expect(response.users[0]).to.have.a.property('groupName')
        expect(response.users[0]).to.have.a.property('sub')
        expect(response.users[0]).to.have.a.property('id')
        expect(response.users[0]).to.have.a.property('projectId')
        expect(response.users[0]).to.have.a.property('creationDate')
      })
  })

  describe('login:remove-user-from-group', () => {
    const validArgs = [
      'login:remove-user-from-group',
      `--group-name=${data.existingGroupName}`,
      `--user-mapping-id=${data.userGroupMappingId}`,
    ]

    test
      .nock(VP_ADAPTER_URL, (api) =>
        api.delete(`/v1/groups/${data.existingGroupName}/users/${data.userGroupMappingId}`).reply(200),
      )
      .stdout()
      .command(validArgs)
      .it('outputs the user and group info', async (ctx) => {
        const response = JSON.parse(ctx.stdout)
        expect(response).to.have.a.property('groupName')
        expect(response).to.have.a.property('userMappingId')
      })
  })
})
