/* eslint-disable @typescript-eslint/no-unused-expressions */
import { test } from '@oclif/test'
import { StatusCodes } from 'http-status-codes'
import { expect } from 'chai'

import { ANALYTICS_URL } from '../../../src/services/analytics'
import {
  createSession,
  getSession,
  USER_MANAGEMENT_URL,
} from '../../../src/services/user-management'
import * as prompts from '../../../src/user-actions'
import { vaultService } from '../../../src/services/vault/typedVaultService'
import { configService, getMajorVersion } from '../../../src/services/config'

const testUserId = '38efcc70-bbe1-457a-a6c7-b29ad9913648'
const testProjectId = 'random-test-project-id'

describe('logout command', () => {
  before(() => {
    createSession('email', testUserId, 'sessionToken')
    configService.create(testUserId, testProjectId)
    configService.optInOrOut(true)
  })
  after(() => {
    configService.clear()
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
    const config = configService.show()
    expect(getSession()).to.be.undefined
    expect(vaultService.getVersion()).to.be.equal(0)
    expect(config.currentUserID).to.equal(testUserId)
    expect(config.version).to.equal(getMajorVersion())
    expect(config.configs).to.haveOwnProperty(testUserId)
    expect(config.configs[testUserId].activeProjectId).to.equal(testProjectId)
    expect(config.configs[testUserId].outputFormat).to.equal('plaintext')
  })
})
