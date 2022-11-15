import { CliUx } from '@oclif/core'
import { expect, test } from '@oclif/test'
import { StatusCodes } from 'http-status-codes'
import fs from 'fs'

import { VERIFIER_URL } from '../../src/services/verification'
import { ServiceDownError, Unauthorized, verifierBadRequest, WrongFileType } from '../../src/errors'

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
      .nock(`${VERIFIER_URL}`, (api) =>
        api.post('/verifier/verify-vcs').reply(StatusCodes.BAD_REQUEST),
      )
      .stub(fs.promises, 'readFile', () => '{"data":"some-data"}')
      .stub(CliUx.ux.action, 'start', () => () => doNothing)
      .stub(CliUx.ux.action, 'stop', () => doNothing)
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
      .stdout()
      .command(['verify-vc', `-d ${vcFile}`])
      .it('runs verify-vc with unauthorized user', (ctx) => {
        expect(ctx.stdout).to.contain(Unauthorized)
      })
  })
  describe('Invalid file directory', () => {
    test

      .stub(fs.promises, 'readFile', () => {
        throw Error(WrongFileType.message)
      })
      .stub(CliUx.ux.action, 'start', () => () => doNothing)
      .stub(CliUx.ux.action, 'stop', () => doNothing)
      .stdout()
      .command(['verify-vc', `-d file/systme`])
      .it('runs verify-vc invalid file directory', (ctx) => {
        expect(ctx.stdout).to.contain(WrongFileType)
      })
  })
})
