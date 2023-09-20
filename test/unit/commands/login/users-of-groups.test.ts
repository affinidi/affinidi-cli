import { expect, test } from '@oclif/test'

let userToGroupMapping: any, userToGroupMappingId: any

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
      .skip()
      .stdout()
      .command(validArgs)
      .it('outputs the user and group info', async (ctx) => {
        const response = JSON.parse(ctx.stdout)
        userToGroupMapping = response
        userToGroupMappingId = response.id

        expect(response).to.have.a.property('ari')
        expect(response).to.have.a.property('groupName')
        expect(response).to.have.a.property('groupAri')
        expect(response).to.have.a.property('sub')
        expect(response).to.have.a.property('id')
        expect(response).to.have.a.property('projectId')
        expect(response).to.have.a.property('creationDate')
      })

    test
      .skip()
      .stdout()
      .command(validArgs)
      .it('returns error if trying to add the same user to the same group', async (ctx) => {
        const response = ctx.stdout

        expect(response).to.contain(
          'The resource you are trying to create already exists. Please, make sure the resource identifier is unique',
        )
      })
  })

  describe('login:list-users-in-group', () => {
    const validArgs = ['login:list-users-in-group', `--group-name=${data.existingGroupName}`]

    test
      .skip()
      .stdout()
      .command(validArgs)
      .it('outputs the list of users in group', async (ctx) => {
        const response = JSON.parse(ctx.stdout)

        expect(response).to.have.a.property('mappings')
        expect(response.mappings).to.deep.include.members([userToGroupMapping])
      })
  })

  describe('login:remove-user-from-group', () => {
    const validArgs = [
      'login:remove-user-from-group',
      `--group-name=${data.existingGroupName}`,
      `--user-mapping-id=${data.userGroupMappingId}`,
    ]

    test
      .skip()
      .stdout()
      .command(validArgs)
      .it('removes user from group', async (ctx) => {
        const response = JSON.parse(ctx.stdout)

        expect(response).to.have.a.property('groupName')
        expect(response).to.have.a.property('userMappingId')
      })
  })
})
