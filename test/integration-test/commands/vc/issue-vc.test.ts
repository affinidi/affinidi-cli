import { expect, test } from '@oclif/test'
import { credSubjectCSVPath, credSubjectJSONPath, schmeaUrl } from '../../helpers/constants'

describe('User issues a VC', () => {
  test
    .stdout()
    .command(['issue-vc', 'target@email.com', '-s', `${schmeaUrl}`, '-d', `${credSubjectJSONPath}`])
    .it('issues single vc', (ctx) => {
      expect(ctx.stdout).to.contains('id :')
    })
  test
    .stdout()
    .command(['issue-vc', '-s', `${schmeaUrl}`, '-d', `${credSubjectCSVPath}`, '-b'])
    .it('issues bulk vcs', (ctx) => {
      expect(ctx.stdout).to.contains('id :')
    })
})
