import { expect, test } from '@oclif/test'
import { credSubjectCSVPath, credSubjectJSONPath, schemaUrl } from '../../helpers/constants'

describe('User issues a VC', () => {
  test
    .stdout()
    .command(['issue-vc', 'target@email.com', '-s', `${schemaUrl}`, '-d', `${credSubjectJSONPath}`])
    .it('issues single vc', (ctx) => {
      expect(ctx.stdout).to.contains('id :')
    })
  test
    .stdout()
    .command(['issue-vc', '-s', `${schemaUrl}`, '-d', `${credSubjectCSVPath}`, '-b'])
    .it('issues bulk vcs', (ctx) => {
      expect(ctx.stdout).to.contains('id :')
    })
})
