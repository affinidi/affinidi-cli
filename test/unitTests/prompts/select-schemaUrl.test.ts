import { expect } from 'chai'
import { stdin } from 'mock-stdin'
import { selectSchemaUrl } from '../../../src/user-actions/inquirer'
import { mockSchemaDto, mockSchemaDtoTwo } from '../../../src/fixtures/mock-schemas'

import { keys } from './constants'

describe('test select schema id inquirer', () => {
  const io = stdin()
  const sendKeystrokes = async () => {
    io.send(keys.down)
    io.send(keys.enter)
  }
  setTimeout(() => sendKeystrokes().then(), 1000)
  after(() => io.restore())
  it('select a schema from list', async () => {
    const project = await selectSchemaUrl(mockSchemaDto.schemas, 10, 10)
    expect(project).to.equal(mockSchemaDtoTwo.jsonSchemaUrl)
  })
})
