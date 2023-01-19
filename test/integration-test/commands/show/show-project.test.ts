import { expect, test } from '@oclif/test'

describe('User show project', () => {
  test
    .stdout()
    .command(['show project', '0f0b3a32-5d65-43bb-a47c-d7036405745d'])
    .it('show the first project from listed projects', (ctx) => {
      expect(ctx.stdout).to.contains('Test Project 97')
    })
})
