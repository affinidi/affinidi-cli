import { expect, test } from '@oclif/test'
import { projectsCreated } from '../../helpers/constants'

describe('User lists projects', () => {
  test
    .stdout()
    .command(['list projects'])
    .it('list all projects of this account', async (ctx) => {
      projectsCreated.forEach((project) => {
        expect(ctx.stdout).to.contains(project)
      })
    })
})
