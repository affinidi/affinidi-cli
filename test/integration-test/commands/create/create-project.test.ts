import { expect, test } from '@oclif/test'
import { projectsCreated } from '../../helpers/constants'

const randomName = () => `Test Project ${Math.floor(Math.random() * 100)}`
describe.skip('User creates a new project', () => {
  const projectName = randomName()
  test
    .stdout()
    .command(['create project', `${projectName}`])
    .it('create a new project', async (ctx) => {
      expect(ctx.stdout).to.contains(projectName)
      projectsCreated.push(projectName)
    })
})
