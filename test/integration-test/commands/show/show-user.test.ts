import { expect, test } from '@oclif/test'
import { testInbox } from '../../helpers'

describe('User shows user info', () => {
  test
    .stdout()
    .command(['show user'])
    .it("show user's info", (ctx) => {
      expect(ctx.stdout).to.contains(testInbox.email)
    })
})
