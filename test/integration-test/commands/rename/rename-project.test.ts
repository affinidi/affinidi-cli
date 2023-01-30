import { expect, test } from '@oclif/test'

describe('User renames a project', () => {
  test
    .stdin('\n', 2000)
    .stdout()
    .command(['rename project', '-n', 'New Project Rename'])
    .it('renames a project based on project id', (ctx) => {
      expect(ctx.stdout).to.contains('New Project Rename')
    })
})
