import { test } from '@oclif/test'
import { StatusCodes } from 'http-status-codes'
import { expect } from 'chai'

import { ANALYTICS_URL } from '../../../src/services/analytics'
import { createSession, USER_MANAGEMENT_URL } from '../../../src/services/user-management'
import * as prompts from '../../../src/user-actions'
import { vaultService, VAULT_KEYS } from '../../../src/services'

describe('logout command', () => {
  before(() => {
    createSession('email', 'userId', 'sessionToken')
  })
  test
    .nock(`${USER_MANAGEMENT_URL}`, (api) => api.post('/auth/logout').reply(StatusCodes.CREATED))
    .nock(`${ANALYTICS_URL}`, (api) => api.post('/api/events').reply(StatusCodes.CREATED))
    .stdout()
    .stub(prompts, 'confirmSignOut', () => async () => prompts.AnswerYes)
    .command(['logout'])
    .it('runs logout and shows a thank you message', (ctx) => {
      expect(ctx.stdout).to.contain("Thank you for using Affinidi's services")
    })

  it('makes sure that there are not credential data anymore', () => {
    Object.keys(VAULT_KEYS).forEach((k) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      expect(vaultService.get(k)).to.be.null
    })
  })
})
