import { expect, test } from '@oclif/test'

describe('User lists projects', () => {
  test
    .stdin('\n', 2000)
    .stdout()
    .command(['rename project', '-n', 'New Project Rename'])
    .it('list all projects of this account', (ctx) => {
      expect(ctx.stdout).to.contains('New Project Rename')
    })
})
