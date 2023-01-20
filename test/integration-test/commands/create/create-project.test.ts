import { expect, test } from '@oclif/test'

const randomName = () => `Test Project ${Math.floor(Math.random() * 100)}`
describe('User creates a new project', () => {
  const projectName = randomName()
  test
    .stdout()
    .command(['create project', `${projectName}`])
    .it('create a new project', (ctx) => {
      expect(ctx.stdout).to.contains(projectName)
    })
})
