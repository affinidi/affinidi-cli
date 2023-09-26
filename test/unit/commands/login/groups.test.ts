import { expect, test } from '@oclif/test'
import { VP_ADAPTER_URL } from '../../../../src/services/urls'

const data = {
  newGroupName: 'new-group-name',
  invalidGroupName: 'group name',
  nonExistentGroupName: '12345',
}

describe('login: group management commands', function () {
  describe('login:create-group', () => {
    const validArgs = ['login:create-group', `--name=${data.newGroupName}`]

    test
      .nock(VP_ADAPTER_URL, (api) =>
        api.post('/v1/groups').reply(200, {
          ari: 'ari:identity:ap-southeast-1:1afac523-9ed4-4b72-af29-16c376b5a32a:group/new-group-name',
          groupName: 'new-group-name',
          projectId: '1afac523-9ed4-4b72-af29-16c376b5a32a',
          creationDate: '2023-09-22T04:53:56.227Z',
        }),
      )
      .stdout()
      .command(validArgs)
      .it('outputs the created user group info', async (ctx) => {
        const response = JSON.parse(ctx.stdout)
        expect(response).to.have.a.property('ari')
        expect(response).to.have.a.property('groupName')
        expect(response).to.have.a.property('projectId')
        expect(response).to.have.a.property('creationDate')
      })
  })

  describe('login:get-group', () => {
    const validArgs = ['login:get-group', `--name=${data.newGroupName}`]

    test
      .nock(VP_ADAPTER_URL, (api) =>
        api.get(`/v1/groups/${data.newGroupName}`).reply(200, {
          ari: 'ari:identity:ap-southeast-1:1afac523-9ed4-4b72-af29-16c376b5a32a:group/new-group-name',
          groupName: 'new-group-name',
          projectId: '1afac523-9ed4-4b72-af29-16c376b5a32a',
          creationDate: '2023-09-22T04:53:56.227Z',
        }),
      )
      .stdout()
      .command(validArgs)
      .it('outputs the user group info', async (ctx) => {
        const response = JSON.parse(ctx.stdout)
        expect(response).to.have.a.property('ari')
        expect(response).to.have.a.property('groupName')
        expect(response).to.have.a.property('projectId')
        expect(response).to.have.a.property('creationDate')
      })
  })

  describe('login:list-groups', () => {
    const validArgs = ['login:list-groups']

    test
      .nock(VP_ADAPTER_URL, (api) =>
        api.get(`/v1/groups`).reply(200, {
          groups: [
            {
              ari: 'ari:identity:ap-southeast-1:1afac523-9ed4-4b72-af29-16c376b5a32a:group/new-group-name',
              groupName: 'new-group-name',
              projectId: '1afac523-9ed4-4b72-af29-16c376b5a32a',
              creationDate: '2023-09-22T04:53:56.227Z',
            },
          ],
        }),
      )
      .stdout()
      .command(validArgs)
      .it('outputs the list of user groups', async (ctx) => {
        const response = JSON.parse(ctx.stdout)
        expect(response).to.have.a.property('groups')
        expect(response.groups[0]).to.have.a.property('ari')
        expect(response.groups[0]).to.have.a.property('groupName')
        expect(response.groups[0]).to.have.a.property('projectId')
        expect(response.groups[0]).to.have.a.property('creationDate')
      })
  })

  describe('login:delete-group', () => {
    const validArgs = ['login:delete-group', `--name=${data.newGroupName}`]
    test
      .nock(VP_ADAPTER_URL, (api) => api.delete(`/v1/groups/${data.newGroupName}`).reply(200))
      .stdout()
      .command(validArgs)
      .it('deletes the mentioned user group', async (ctx) => {
        const response = JSON.parse(ctx.stdout)
        expect(response).to.have.a.property('name')
      })
  })
})
