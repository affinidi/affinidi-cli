import { expect, test } from '@oclif/test'

const data = {
  newGroupName: 'new-group-name',
  invalidGroupName: 'group name',
  nonExistentGroupName: '12345',
}

let createdGroup: any
describe('login: group management commands', function () {
  describe('login:create-group', () => {
    const validArgs = ['login:create-group', `--group-name=${data.newGroupName}`]

    test
      .skip()
      .stdout()
      .command(validArgs)
      .it('outputs the created user group info', async (ctx) => {
        const response = JSON.parse(ctx.stdout)

        expect(response).to.have.a.property('ari')
        expect(response).to.have.a.property('name')
        expect(response).to.have.a.property('projectId')
        expect(response).to.have.a.property('creationDate')

        createdGroup = response
      })

    test
      .skip()
      .stdout()
      .command(validArgs)
      .it('returns error if trying to create group with the same name', async (ctx) => {
        const response = ctx.stdout

        expect(response).to.contain(
          'The resource you are trying to create already exists. Please, make sure the resource identifier is unique',
        )
      })

    const invalidArgs = ['login:create-group', `--group-name=${data.invalidGroupName}`]

    test
      .skip()
      .stdout()
      .command(invalidArgs)
      .it('returns error if trying to create group with invalid name', async (ctx) => {
        const response = ctx.stdout

        expect(response).to.contain(
          'Invalid input parameters. Please, check the validity of entered values. \nUse flag --help with the command to get details about input parameters',
        )
      })
  })

  describe('login:get-group', () => {
    const validArgs = ['login:get-group', `--group-name=${data.newGroupName}`]

    test
      .skip()
      .stdout()
      .command(validArgs)
      .it('outputs the specified user group info', async (ctx) => {
        const response = JSON.parse(ctx.stdout)

        expect(response).to.have.a.property('ari')
        expect(response).to.have.a.property('name')
        expect(response).to.have.a.property('projectId')
        expect(response).to.have.a.property('creationDate')
      })

    const invalidArgs = ['login:get-group', `--group-name=${data.nonExistentGroupName}`]

    test
      .skip()
      .stdout()
      .command(invalidArgs)
      .it('returns error if group-name is invalid', async (ctx) => {
        const response = ctx.stdout

        expect(response).to.contain(
          'The resource you are trying to access is not found. Please, check the entered resource identifier',
        )
      })
  })

  describe('login:list-groups', () => {
    const validArgs = ['login:list-groups']

    test
      .skip()
      .stdout()
      .command(validArgs)
      .it("outputs the list of developer's user groups", async (ctx) => {
        const response = JSON.parse(ctx.stdout)

        expect(response).to.have.a.property('groups')
        expect(response.groups).to.deep.include.members([createdGroup])
      })
  })

  describe('login:delete-group', () => {
    const validArgs = ['login:delete-group', `--group-name=${data.newGroupName}`]

    test
      .skip()
      .stdout()
      .command(validArgs)
      .it('outputs the deleted group name', async (ctx) => {
        const response = JSON.parse(ctx.stdout)

        expect(response).to.have.a.property('groupName')
      })
  })
})
