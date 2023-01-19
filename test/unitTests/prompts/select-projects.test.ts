import { expect } from 'chai'
import { stdin } from 'mock-stdin'
import { projectList } from '../../../src/fixtures/mock-projects'
import { selectProject } from '../../../src/user-actions'
import { keys } from './constants'

describe('test select project inquirer', () => {
  const io = stdin()
  const sendKeystrokes = async () => {
    io.send(keys.down)
    io.send(keys.enter)
  }
  setTimeout(() => sendKeystrokes().then(), 1000)
  after(() => io.restore())
  it('select a project from list', async () => {
    const project = await selectProject(projectList.projects, 10)
    expect(project).to.equal('some-project2-id')
  })
})
