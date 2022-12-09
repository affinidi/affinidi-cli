import { CliUx } from '@oclif/core'
import { expect, test } from '@oclif/test'
import { StatusCodes } from 'http-status-codes'
import fs from 'fs'

import { VERIFIER_URL } from '../../../src/services/verification'
import {
  ServiceDownError,
  Unauthorized,
  verifierBadRequest,
  WrongFileType,
} from '../../../src/errors'
import { ANALYTICS_URL } from '../../../src/services/analytics'
import { configService } from '../../../src/services'
import * as authentication from '../../../src/middleware/authentication'

const testUserId = '38efcc70-bbe1-457a-a6c7-b29ad9913648'
const testProjectId = 'random-test-project-id'
const doNothing = () => {}
const vcFile = 'som/vs/file.json'
const verifyVcResponse = {
  isValid: true,
  errors: '[]',
}
describe('verify-vc command', () => {
  before(() => {
    configService.create(testUserId, testProjectId)
    configService.optInOrOut(true)
  })
  after(() => {
    configService.clear()
  })
  test
    .nock(`${VERIFIER_URL}`, (api) =>
      api.post('/verifier/verify-vcs').reply(StatusCodes.OK, verifyVcResponse),
    )
    .stub(fs.promises, 'readFile', () => '{"data":"some-data"}')
    .stub(CliUx.ux.action, 'start', () => () => doNothing)
    .stub(CliUx.ux.action, 'stop', () => doNothing)
    .stub(authentication, 'isAuthenticated', () => true)
    .stdout()
    .command(['verify-vc', `-d ${vcFile}`])
    .it('runs verify-vc', (ctx) => {
      expect(ctx.stdout).to.contain(`isValid : true`)
    })

  describe('Bad request', () => {
    test
      .nock(`${VERIFIER_URL}`, (api) =>
        api.post('/verifier/verify-vcs').reply(StatusCodes.BAD_REQUEST),
      )
      .stub(fs.promises, 'readFile', () => '{"data":"some-data"}')
      .stub(CliUx.ux.action, 'start', () => () => doNothing)
      .stub(CliUx.ux.action, 'stop', () => doNothing)
      .stub(authentication, 'isAuthenticated', () => true)
      .stdout()
      .command(['verify-vc', `-d ${vcFile}`])
      .it('runs verify-vc with bad request', (ctx) => {
        expect(ctx.stdout).to.contain(verifierBadRequest)
      })
  })
  describe('Server Down', () => {
    test
      .nock(`${VERIFIER_URL}`, (api) =>
        api.post('/verifier/verify-vcs').reply(StatusCodes.INTERNAL_SERVER_ERROR),
      )
      .stub(fs.promises, 'readFile', () => '{"data":"some-data"}')
      .stub(CliUx.ux.action, 'start', () => () => doNothing)
      .stub(CliUx.ux.action, 'stop', () => doNothing)
      .stub(authentication, 'isAuthenticated', () => true)
      .stdout()
      .command(['verify-vc', `-d ${vcFile}`])
      .it('runs verify-vc when server is down', (ctx) => {
        expect(ctx.stdout).to.contain(ServiceDownError)
      })
  })

  describe('Unauthorized', () => {
    test
      .nock(`${VERIFIER_URL}`, (api) =>
        api.post('/verifier/verify-vcs').reply(StatusCodes.UNAUTHORIZED),
      )
      .stub(fs.promises, 'readFile', () => '{"data":"some-data"}')
      .stub(CliUx.ux.action, 'start', () => () => doNothing)
      .stub(CliUx.ux.action, 'stop', () => doNothing)
      .stub(authentication, 'isAuthenticated', () => true)
      .stdout()
      .command(['verify-vc', `-d ${vcFile}`])
      .it('runs verify-vc with unauthorized user', (ctx) => {
        expect(ctx.stdout).to.contain(Unauthorized)
      })
  })
  describe('Invalid file directory', () => {
    test

      .stub(fs.promises, 'readFile', () => {
        throw Error(WrongFileType)
      })
      .stub(CliUx.ux.action, 'start', () => () => doNothing)
      .stub(CliUx.ux.action, 'stop', () => doNothing)
      .stub(authentication, 'isAuthenticated', () => true)
      .stdout()
      .command(['verify-vc', `-d file/systme`])
      .it('runs verify-vc invalid file directory', (ctx) => {
        expect(ctx.stdout).to.contain(WrongFileType)
      })
  })
})
