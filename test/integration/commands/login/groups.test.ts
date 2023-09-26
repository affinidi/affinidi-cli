import { test, expect } from '@oclif/test'
import { data } from './data'

// TODO: Don't show JSON output for commands, it happens because of
//       if (!this.jsonEnabled()) this.logJson(createGroupOutput)
describe('login create-group', () => {
  const validArgs = ['login create-group', `--name=${data.newGroupName}`]

  test.command(validArgs).it('outputs the created user group info', async (ctx: any) => {
    const response = ctx.returned

    expect(response).to.have.a.property('ari')
    expect(response).to.have.a.property('groupName')
    expect(response).to.have.a.property('projectId')
    expect(response).to.have.a.property('creationDate')
  })

  test
    .stderr()
    .command(validArgs)
    .catch((ctx) => {
      expect(ctx.message).to.contain('The resource you are trying to create already exists')
    })
    .it('returns error if trying to create group with the same name')

  // const invalidArgs = ['login create-group', `--name=${data.invalidGroupName}`]
})

describe('login:get-group', () => {
  const validArgs = ['login:get-group', `--name=${data.newGroupName}`]

  test
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

describe('login delete-group', () => {
  const validArgs = ['login delete-group', `--name=${data.newGroupName}`]

  test.command(validArgs).it('outputs the deleted group name', async (ctx: any) => {
    const response = ctx.returned

    expect(response).to.have.a.property('name')
  })
})
