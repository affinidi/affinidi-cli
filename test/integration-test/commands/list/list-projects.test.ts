import { expect, test } from '@oclif/test'

describe('User lists projects', () => {
  test
    .stdout()
    .command(['list projects'])
    .it('list all projects of this account', (ctx) => {
      expect(ctx.stdout).to.contains('Test Project')
    })
})
