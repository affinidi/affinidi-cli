import { CliUx } from '@oclif/core'
import { expect, test } from '@oclif/test'
import { StatusCodes } from 'http-status-codes'
import fs from 'fs'

import { VERIFIER_URL } from '../../src/services/verification'
import {
  badRequest,
  emptyIssueDataFlag,
  noSuchFileOrDir,
  ServiceDownError,
  Unauthorized,
} from '../../src/errors'

const doNothing = () => {}
const vcFile = 'som/vs/file.json'
const verifyVcResponse = {
  isValid: true,
  errors: '[]',
}
describe('verify-vc', () => {
  test
    .nock(`${VERIFIER_URL}`, (api) =>
      api.post('/verifier/verify-vcs').reply(StatusCodes.OK, verifyVcResponse),
    )
    .stub(fs.promises, 'readFile', () => '{"data":"some-data"}')
    .stub(CliUx.ux.action, 'start', () => () => doNothing)
    .stub(CliUx.ux.action, 'stop', () => doNothing)
    .stdout()
    .command(['verify-vc', `-d ${vcFile}`])
    .it('runs verify-vc', (ctx) => {
      expect(ctx.stdout).to.contain(`"isValid": true`)
    })

  describe('Bad request', () => {
    test
      .nock(`${VERIFIER_URL}`, (api) => api.post('/verifier/verify-vcs').replyWithError(badRequest))
      .stub(fs.promises, 'readFile', () => '{"data":"some-data"}')
      .stub(CliUx.ux.action, 'start', () => () => doNothing)
      .stub(CliUx.ux.action, 'stop', () => doNothing)
      .stdout()
      .command(['verify-vc', `-d ${vcFile}`])
      .it('runs verify-vc with bad request', (ctx) => {
        expect(ctx.stdout).to.contain(badRequest)
      })
  })
  describe('Server Down', () => {
    test
      .nock(`${VERIFIER_URL}`, (api) =>
        api.post('/verifier/verify-vcs').replyWithError(ServiceDownError),
      )
      .stub(fs.promises, 'readFile', () => '{"data":"some-data"}')
      .stub(CliUx.ux.action, 'start', () => () => doNothing)
      .stub(CliUx.ux.action, 'stop', () => doNothing)
      .stdout()
      .command(['verify-vc', `-d ${vcFile}`])
      .it('runs verify-vc when server is down', (ctx) => {
        expect(ctx.stdout).to.contain(ServiceDownError)
      })
  })

  describe('Unauthorized', () => {
    test
      .nock(`${VERIFIER_URL}`, (api) =>
        api.post('/verifier/verify-vcs').replyWithError(Unauthorized),
      )
      .stub(fs.promises, 'readFile', () => '{"data":"some-data"}')
      .stub(CliUx.ux.action, 'start', () => () => doNothing)
      .stub(CliUx.ux.action, 'stop', () => doNothing)
      .stdout()
      .command(['verify-vc', `-d ${vcFile}`])
      .it('runs verify-vc with unauthorized user', (ctx) => {
        expect(ctx.stdout).to.contain(Unauthorized)
      })
  })
  describe('Invalid file directory', () => {
    test

      .stub(fs.promises, 'readFile', () => {
        throw Error(noSuchFileOrDir.message)
      })
      .stub(CliUx.ux.action, 'start', () => () => doNothing)
      .stub(CliUx.ux.action, 'stop', () => doNothing)
      .stdout()
      .command(['verify-vc', `-d file/systme`])
      .it('runs verify-vc invalid file directory', (ctx) => {
        expect(ctx.stdout).to.contain(noSuchFileOrDir)
      })
  })
  describe('Not providing a json file', () => {
    test

      .stub(fs.promises, 'readFile', () => {
        throw Error(emptyIssueDataFlag.message)
      })
      .stub(CliUx.ux.action, 'start', () => () => doNothing)
      .stub(CliUx.ux.action, 'stop', () => doNothing)
      .stdout()
      .command(['verify-vc'])
      .it('runs verify-vc without prviding verifiable credential', (ctx) => {
        expect(ctx.stdout).to.contain(emptyIssueDataFlag)
      })
  })
})
