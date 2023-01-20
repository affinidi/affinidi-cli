import { expect, test } from '@oclif/test'
import { StatusCodes } from 'http-status-codes'
import { vaultService } from '../../../../src/services/vault/typedVaultService'

import { Unauthorized } from '../../../../src/errors'
import { createSession, USER_MANAGEMENT_URL } from '../../../../src/services/user-management'

const testUserId = '38efcc70-bbe1-457a-a6c7-b29ad9913648'
const testUsername = 'testUsername'
const testUserObject = { userId: testUserId, username: testUsername }

describe('show user', () => {
  before(() => {
    createSession(testUsername, testUserId, 'sessionToken')
  })
  after(() => {
    vaultService.clear()
  })

  describe('logged out', () => {
    before(() => {
      vaultService.clear()
    })
    test
      .stdout()
      .command(['show user'])
      .it('Fails if not logged in', (ctx) => {
        expect(ctx.stdout).to.contain(Unauthorized)
      })
  })

  test
    .nock(`${USER_MANAGEMENT_URL}`, (api) =>
      api.get('/auth/me').reply(StatusCodes.OK, testUserObject),
    )
    .stdout()
    .command(['show user'])
    .it('Shows current user', (ctx) => {
      expect(ctx.stdout).to.contain(`userId : ${testUserId}`)
      expect(ctx.stdout).to.contain(`username : ${testUsername}`)
    })

  test
    .nock(`${USER_MANAGEMENT_URL}`, (api) =>
      api.get('/auth/me').reply(StatusCodes.OK, testUserObject),
    )
    .stdout()
    .command(['show user', '-o', 'json'])
    .it('Shows current user', (ctx) => {
      expect(ctx.stdout).to.contain(JSON.stringify(testUserObject, null, '  '))
    })
})
