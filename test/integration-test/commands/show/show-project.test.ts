import { expect, test } from '@oclif/test'

describe('User show project', () => {
  test
    .stdout()
    .command(['show project', 'b9557e5f-c61c-44a5-a912-77aab58e7608'])
    .it('show a project given an ID', (ctx) => {
      expect(ctx.stdout).to.contains('Test Project 97')
    })
})
