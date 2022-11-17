import { expect, test } from '@oclif/test'

describe('use', () => {
  test
    .stdout()
    .command(['use'])
    .it('runs use and shows the help', (ctx) => {
      expect(ctx.stdout).to.contain('The use command selects')
    })
})
