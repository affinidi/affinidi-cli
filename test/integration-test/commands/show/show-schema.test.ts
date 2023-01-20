import { expect, test } from '@oclif/test'
import { publicDescription } from '../../helpers/constants'

describe('User shows schema', () => {
  test
    .stdout()
    .command(['show schema', 'TestSchemaPublicV1-12'])
    .it('show a schema given an ID', (ctx) => {
      expect(ctx.stdout).to.contains(publicDescription)
      expect(ctx.stdout).to.contains('TestSchemaPublicV1-12')
    })
})
