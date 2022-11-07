import { test, expect } from '@oclif/test'
import { StatusCodes } from 'http-status-codes'
import fs from 'fs'
import { CliUx } from '@oclif/core'

import {
  couldNotParseSchema,
  emptyIssueDataFlag,
  noSuchFileOrDir,
  ServiceDownError,
  Unauthorized,
} from '../../src/errors'

const ISSUANCE_URL = `https://console-vc-issuance.prod.affinity-project.org/api/v1`
const issuanceRespnse = {
  id: 'some-vc-id',
}
const schema = 'https://schema.affinidi.com/awesomeV1-0.json'
const offerResponse = {
  id: 'some-project-id',
  status: 'CREATED',
  statusLog: [
    {
      status: 'CREATED',
      at: '2022-11-03T21:11:09.081Z',
    },
  ],
  expiresAt: '2022-12-03T21:11:09.081Z',
  issuerDid: 'some-project-did',
  schema: {
    type: 'awesome',
    jsonSchemaUrl: `${schema}`,
    jsonLdContextUrl: `${schema}ld`,
  },
  verification: {
    method: 'email',
    target: {
      email: 'email',
    },
  },
}
const doNothing = () => {}
const jsonFile = 'some-user/some-folder/someFile.json'
const projectId = 'some-project-id'

describe('issue-vc', () => {
  test
    .nock(`${ISSUANCE_URL}`, (api) => api.post('/issuances').reply(StatusCodes.OK, issuanceRespnse))
    .nock(`${ISSUANCE_URL}`, (api) =>
      api.post(`/issuances/some-vc-id/offers`).reply(StatusCodes.OK, offerResponse),
    )
    .stub(fs.promises, 'readFile', () => '{"data":"some-data"}')
    .stub(CliUx.ux.action, 'start', () => () => doNothing)
    .stub(CliUx.ux.action, 'stop', () => doNothing)
    .stdout()
    .command(['issue-vc', `-s ${schema}`, `-d ${jsonFile}`])
    .it('runs issue-vc', (ctx) => {
      expect(ctx.stdout).to.contain(`"id": "${projectId}"`)
      expect(ctx.stdout).to.contain(`"jsonSchemaUrl": "${schema}"`)
    })

  describe('issuance of vc without authentication', () => {
    test
      .nock(`${ISSUANCE_URL}`, (api) => api.post('/issuances').replyWithError(Unauthorized))
      .stub(fs.promises, 'readFile', () => '{"data":"some-data"}')
      .stub(CliUx.ux.action, 'start', () => () => doNothing)
      .stub(CliUx.ux.action, 'stop', () => doNothing)
      .stdout()
      .command(['issue-vc', `-s ${schema}`, `-d ${jsonFile}`])
      .it('runs issue-vc when not authenticated', (ctx) => {
        expect(ctx.stdout).to.contain(Unauthorized)
      })
  })
  describe('issuance of vc when server is down', () => {
    test
      .nock(`${ISSUANCE_URL}`, (api) => api.post('/issuances').replyWithError(ServiceDownError))
      .stub(fs.promises, 'readFile', () => '{"data":"some-data"}')
      .stub(CliUx.ux.action, 'start', () => () => doNothing)
      .stub(CliUx.ux.action, 'stop', () => doNothing)
      .stdout()
      .command(['issue-vc', `-s ${schema}`, `-d ${jsonFile}`])
      .it('runs issue-vc when not authenticated', (ctx) => {
        expect(ctx.stdout).to.contain(ServiceDownError)
      })
  })
  describe('issuance of vc without providing a schema URL', () => {
    test
      .stub(CliUx.ux.action, 'start', () => () => doNothing)
      .stub(CliUx.ux.action, 'stop', () => doNothing)
      .stdout()
      .command(['issue-vc', `-d ${jsonFile}`])
      .it('runs issue-vc with no schema provided', (ctx) => {
        expect(ctx.stdout).to.contain(couldNotParseSchema)
      })
  })
  describe('issuance of vc without providing a json file', () => {
    test
      .stub(fs.promises, 'readFile', () => {
        throw Error(emptyIssueDataFlag.message)
      })
      .stub(CliUx.ux.action, 'start', () => () => doNothing)
      .stub(CliUx.ux.action, 'stop', () => doNothing)
      .stdout()
      .command(['issue-vc', `-s ${schema}`])
      .it('runs issue-vc with no schema provided', (ctx) => {
        expect(ctx.stdout).to.contain(emptyIssueDataFlag)
      })
  })
  describe('issuance of vc providing an invalid json file directory', () => {
    test
      .stub(fs.promises, 'readFile', () => {
        throw Error(noSuchFileOrDir.message)
      })
      .stub(CliUx.ux.action, 'start', () => () => doNothing)
      .stub(CliUx.ux.action, 'stop', () => doNothing)
      .stdout()
      .command(['issue-vc', `-s ${schema}`, '-d file/system'])
      .it('runs issue-vc with invalid directory provided', (ctx) => {
        expect(ctx.stdout).to.contain(noSuchFileOrDir)
      })
  })
  describe('issuance of vc without any flags', () => {
    test
      .stub(CliUx.ux.action, 'start', () => () => doNothing)
      .stub(CliUx.ux.action, 'stop', () => doNothing)
      .stdout()
      .command(['issue-vc'])
      .it('runs issue-vc with invalid directory provided', (ctx) => {
        expect(ctx.stdout).to.contain(couldNotParseSchema)
      })
  })
})
