import { expect, test } from '@oclif/test'

describe('list command', () => {
  test
    .stdout()
    .command(['list'])
    .it('runs list and shows the help', (ctx) => {
      expect(ctx.stdout).to.contain('The list commmand to display')
    })
})
