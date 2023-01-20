import { expect, test } from '@oclif/test'
import { projectList } from '../../../src/fixtures/mock-projects'
import { selectProject } from '../../../src/user-actions'
import { keys } from './constants'

describe('test select project inquirer', () => {
  test.stdin(`${keys.down}\n`, 1000).it('select a project from list', async () => {
    const project = await selectProject(projectList.projects, 10)
    expect(project).to.equal('some-project2-id')
  })
})
