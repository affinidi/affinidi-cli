import { expect, test } from '@oclif/test'

describe('show command', () => {
  test
    .stdout()
    .command(['show'])
    .it('runs show and shows the help', (ctx) => {
      expect(ctx.stdout).to.contain('Use the show command')
    })
})
