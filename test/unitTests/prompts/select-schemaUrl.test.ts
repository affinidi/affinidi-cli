import { expect, test } from '@oclif/test'
import { selectSchemaUrl } from '../../../src/user-actions/inquirer'
import { mockSchemaDto, mockSchemaDtoTwo } from '../../../src/fixtures/mock-schemas'

import { keys } from './constants'

describe('test select schema id inquirer', () => {
  test.stdin(`${keys.down}\n`, 1000).it('select a schema from list', async () => {
    const project = await selectSchemaUrl(mockSchemaDto.schemas, 10, 10)
    expect(project).to.equal(mockSchemaDtoTwo.jsonSchemaUrl)
  })
})
