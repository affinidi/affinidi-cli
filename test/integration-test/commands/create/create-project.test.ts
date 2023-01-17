import { expect, test } from '@oclif/test'

const randomName = () => `Test Project ${Math.floor(Math.random() * 100)}`
describe('User Logs in, creates a new project and generates an application', () => {
  const projectName = randomName()
  test
    .stdout()
    .command(['create project', `${projectName}`])
    .it('list all projects of this account', async (ctx) => {
      expect(ctx.stdout).to.contains(projectName)
    })
})
