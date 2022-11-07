import { expect, test } from '@oclif/test'
import { StatusCodes } from 'http-status-codes'
import { vaultService, VAULT_KEYS } from '../../../src/services'

import { USER_MANAGEMENT_URL } from '../../../src/services/user-management'
import * as prompts from '../../../src/user-actions'

describe('logout command', () => {
  before(() => {
    vaultService.set(VAULT_KEYS.sessionToken, 'some-token')
  })
  test
    .nock(`${USER_MANAGEMENT_URL}`, (api) => api.post('/auth/logout').reply(StatusCodes.CREATED))
    .stdout()
    .stub(prompts, 'confirmSignOut', () => async () => prompts.AnswerYes)
    .command(['logout'])
    .it('runs logout and shows a thank you message', (ctx) => {
      expect(ctx.stdout).to.contain("Thank you for using Affinidi's services")
    })
})
