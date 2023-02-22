import { expect, test } from '@oclif/test'
import { vcPath } from '../../helpers/constants'

describe('User verifies a VC', () => {
  test
    .stdout()
    .command(['verify-vc', '-d', `${vcPath}`])
    .it('verify  vc', (ctx) => {
      expect(ctx.stdout).to.contains('isValid : true')
    })
})
