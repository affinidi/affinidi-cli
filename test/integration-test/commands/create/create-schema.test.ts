import { expect, test } from '@oclif/test'

const schemaPath = 'test/integration-test/static/testSchema.json'
const unlistedDescription = 'test schema unlisted'
const publicDescription = 'test schema public'

describe('User creates a new schema', () => {
  test
    .stdout()
    .command([
      'create schema',
      `TestSchemaUnlisted`,
      '-d',
      `${unlistedDescription}`,
      '-s',
      `${schemaPath}`,
    ])
    .it('create a new unlisted schema', (ctx) => {
      expect(ctx.stdout).to.contains('unlisted')
      expect(ctx.stdout).to.contains(unlistedDescription)
    })
  test
    .stdout()
    .command([
      'create schema',
      `TestSchemaPublic`,
      '-p',
      'true',
      '-d',
      `${publicDescription}`,
      '-s',
      `${schemaPath}`,
    ])
    .it('create a new public schema', (ctx) => {
      expect(ctx.stdout).to.contains('public')
      expect(ctx.stdout).to.contains(publicDescription)
    })
})
