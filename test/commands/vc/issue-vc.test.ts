import { test, expect } from '@oclif/test'
import { StatusCodes } from 'http-status-codes'
import fs from 'fs'
import { CliUx } from '@oclif/core'

import { ServiceDownError, Unauthorized, WrongFileType } from '../../../src/errors'
import * as prompts from '../../../src/user-actions'
import { ANALYTICS_URL } from '../../../src/services/analytics'
import { configService } from '../../../src/services'
import * as authentication from '../../../src/middleware/authentication'
import { createSession } from '../../../src/services/user-management'
import { vaultService } from '../../../src/services/vault/typedVaultService'
import { projectSummary } from '../../../src/fixtures/mock-projects'

const ISSUANCE_URL = `https://console-vc-issuance.prod.affinity-project.org/api/v1`
const issuanceRespnse = {
  id: 'some-vc-id',
}
const bulkIssuanceRespone = {
  issuance: {
    id: 'some-vc-id',
  },
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
const EXAMPLE_EMAIL = 'example@email.com'
const testUserId = '38efcc70-bbe1-457a-a6c7-b29ad9913648'
const testProjectId = 'random-test-project-id'
const doNothing = () => {}
const jsonFile = 'some-user/some-folder/someFile.json'
const csvFile = 'some-user/some-folder/someFile.csv'

describe('issue-vc command', () => {
  before(() => {
    configService.create(testUserId, testProjectId)
    configService.optInOrOut(true)
    createSession('email', testUserId, 'sessionToken')
    vaultService.setActiveProject(projectSummary)
  })
  after(() => {
    configService.clear()
  })
  test
    .nock(`${ISSUANCE_URL}`, (api) => api.post('/issuances').reply(StatusCodes.OK, issuanceRespnse))
    .nock(`${ISSUANCE_URL}`, (api) =>
      api.post(`/issuances/some-vc-id/offers`).reply(StatusCodes.OK, offerResponse),
    )
    .stub(prompts, 'enterIssuanceEmailPrompt', () => async () => EXAMPLE_EMAIL)
    .stub(fs.promises, 'readFile', () => '{"data":"some-data"}')
    .stub(CliUx.ux.action, 'start', () => () => doNothing)
    .stub(CliUx.ux.action, 'stop', () => doNothing)
    .stdout()
    .command(['issue-vc', `-s ${schema}`, `-d ${jsonFile}`])
    .it('runs issue-vc single issuance', (ctx) => {
      expect(ctx.stdout).to.contain(issuanceRespnse.id)
    })
  describe('bulk issuance of vc', () => {
    test
      .nock(`${ISSUANCE_URL}`, (api) =>
        api.post('/issuances/create-from-csv').reply(StatusCodes.OK, bulkIssuanceRespone),
      )
      .stub(fs.promises, 'readFile', () => '{"data":"some-data"}')
      .stub(CliUx.ux.action, 'start', () => () => doNothing)
      .stub(CliUx.ux.action, 'stop', () => doNothing)
      .stub(authentication, 'isAuthenticated', () => true)
      .stdout()
      .command(['issue-vc', `-s ${schema}`, `-d ${csvFile}`, '-b'])
      .it('runs issue-vc bulk issuance', (ctx) => {
        expect(ctx.stdout).to.contain(bulkIssuanceRespone.issuance.id)
      })
  })
  describe('bulk issuance of vc without authentication', () => {
    test
      .nock(`${ISSUANCE_URL}`, (api) =>
        api.post('/issuances/create-from-csv').reply(StatusCodes.UNAUTHORIZED),
      )
      .stub(prompts, 'enterIssuanceEmailPrompt', () => async () => EXAMPLE_EMAIL)
      .stub(fs.promises, 'readFile', () => '{"data":"some-data"}')
      .stub(CliUx.ux.action, 'start', () => () => doNothing)
      .stub(CliUx.ux.action, 'stop', () => doNothing)
      .stub(authentication, 'isAuthenticated', () => true)
      .stdout()
      .command(['issue-vc', `-s ${schema}`, `-d ${csvFile}`, '-b'])
      .it('runs issue-vc when not authenticated bulk flag is true', (ctx) => {
        expect(ctx.stdout).to.contain(Unauthorized)
      })
  })

  describe('issuance of vc without authentication', () => {
    test
      .nock(`${ISSUANCE_URL}`, (api) => api.post('/issuances').reply(StatusCodes.UNAUTHORIZED))
      .stub(prompts, 'enterIssuanceEmailPrompt', () => async () => EXAMPLE_EMAIL)
      .stub(fs.promises, 'readFile', () => '{"data":"some-data"}')
      .stub(CliUx.ux.action, 'start', () => () => doNothing)
      .stub(CliUx.ux.action, 'stop', () => doNothing)
      .stub(authentication, 'isAuthenticated', () => true)
      .stdout()
      .command(['issue-vc', `-s ${schema}`, `-d ${jsonFile}`])
      .it('runs issue-vc when not authenticated', (ctx) => {
        expect(ctx.stdout).to.contain(Unauthorized)
      })
  })
  describe('bulk issuance of vc when server is down', () => {
    test
      .nock(`${ISSUANCE_URL}`, (api) =>
        api.post('/issuances/create-from-csv').reply(StatusCodes.INTERNAL_SERVER_ERROR),
      )
      .stub(prompts, 'enterIssuanceEmailPrompt', () => async () => EXAMPLE_EMAIL)
      .stub(fs.promises, 'readFile', () => '{"data":"some-data"}')
      .stub(CliUx.ux.action, 'start', () => () => doNothing)
      .stub(CliUx.ux.action, 'stop', () => doNothing)
      .stub(authentication, 'isAuthenticated', () => true)
      .stdout()
      .command(['issue-vc', `-s ${schema}`, `-d ${csvFile}`, '-b'])
      .it('runs issue-vc when not authenticated bulk flag true', (ctx) => {
        expect(ctx.stdout).to.contain(ServiceDownError)
      })
  })
  describe('issuance of vc when server is down', () => {
    test
      .nock(`${ISSUANCE_URL}`, (api) =>
        api.post('/issuances').reply(StatusCodes.INTERNAL_SERVER_ERROR),
      )
      .stub(prompts, 'enterIssuanceEmailPrompt', () => async () => EXAMPLE_EMAIL)
      .stub(fs.promises, 'readFile', () => '{"data":"some-data"}')
      .stub(CliUx.ux.action, 'start', () => () => doNothing)
      .stub(CliUx.ux.action, 'stop', () => doNothing)
      .stub(authentication, 'isAuthenticated', () => true)
      .stdout()
      .command(['issue-vc', `-s ${schema}`, `-d ${jsonFile}`])
      .it('runs issue-vc when not authenticated', (ctx) => {
        expect(ctx.stdout).to.contain(ServiceDownError)
      })
  })
  describe('bulk issuance of vc providing an invalid json file directory', () => {
    test
      .stub(fs.promises, 'readFile', () => {
        throw Error(WrongFileType)
      })
      .stub(prompts, 'enterIssuanceEmailPrompt', () => async () => EXAMPLE_EMAIL)
      .stub(CliUx.ux.action, 'start', () => () => doNothing)
      .stub(CliUx.ux.action, 'stop', () => doNothing)
      .stub(authentication, 'isAuthenticated', () => true)
      .stdout()
      .command(['issue-vc', `-s ${schema}`, '-d file/system', '-b'])
      .it('runs issue-vc with invalid directory provided bulk flag is true', (ctx) => {
        expect(ctx.stdout).to.contain(WrongFileType)
      })
  })

  describe('issuance of vc providing an invalid json file directory', () => {
    test
      .stub(fs.promises, 'readFile', () => {
        throw Error(WrongFileType)
      })
      .stub(prompts, 'enterIssuanceEmailPrompt', () => async () => EXAMPLE_EMAIL)
      .stub(CliUx.ux.action, 'start', () => () => doNothing)
      .stub(CliUx.ux.action, 'stop', () => doNothing)
      .stub(authentication, 'isAuthenticated', () => true)
      .stdout()
      .command(['issue-vc', `-s ${schema}`, '-d file/system'])
      .it('runs issue-vc with invalid directory provided', (ctx) => {
        expect(ctx.stdout).to.contain(WrongFileType)
      })
  })
})
