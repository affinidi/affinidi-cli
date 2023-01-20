import { expect, test } from '@oclif/test'

describe('Logout user', () => {
  test
    .stdout()
    .stdin('y\n', 3000)
    .command(['logout'])
    .it('logs in the user and activates a project', (ctx) => {
      expect(ctx.stdout).to.contains("Thank you for using Affinidi's services")
    })
})
