import { expect, test } from '@oclif/test'

describe('User lists schemas', () => {
  test
    .stdout()
    .command(['list schemas', '-c', 'public'])
    .it('list all public schemas', (ctx) => {
      expect(ctx.stdout).to.contains('TestSchemaPublic')
    })
  test
    .stdout()
    .command(['list schemas', '-c', 'unlisted'])
    .it('list all unlisted schemas', (ctx) => {
      expect(ctx.stdout).to.contains('TestSchemaUnlisted')
    })
})
