import { CliUx } from '@oclif/core'
import { expect, test } from '@oclif/test'
import fs from 'fs'

import { StatusCodes } from 'http-status-codes'
import * as prompts from '../../../src/user-actions'
import * as authentication from '../../../src/middleware/authentication'
import {
  InvalidSchemaName,
  schemaBadrequest,
  ServiceDownError,
  Unauthorized,
  WrongSchemaFileType,
} from '../../../src/errors'
import {
  mockSchemaDto,
  mockSchemaDtoOne,
  mockSchemaDtoUnlisted,
} from '../../../src/fixtures/mock-schemas'
import { SCHEMA_MANAGER_URL } from '../../../src/services/schema-manager'
import { ANALYTICS_URL } from '../../../src/services/analytics'

const SCHEMA_NAME = 'schemaName'
const schemaFile = 'some/file.json'
const doNothing = () => {}
const description = 'Some description'

describe('Create Schema', () => {
  describe('Creating schema unlisted', () => {
    test

      .nock(`${SCHEMA_MANAGER_URL}`, (api) =>
        api
          .get('/schemas?scope=public&skip=0&limit=1&type=schemaName&did=did:elem:AwesomeDID')
          .reply(StatusCodes.OK, mockSchemaDto),
      )
      .nock(`${SCHEMA_MANAGER_URL}`, (api) =>
        api.post('/schemas').reply(StatusCodes.OK, mockSchemaDtoUnlisted),
      )
      .nock(`${ANALYTICS_URL}`, (api) => api.post('/api/events').reply(StatusCodes.CREATED))
      .stdout()
      .stub(authentication, 'isAuthenticated', () => () => true)
      .stub(prompts, 'enterSchemaName', () => async () => SCHEMA_NAME)
      .stub(fs.promises, 'readFile', () => '{"data":"some-data"}')
      .stub(CliUx.ux.action, 'start', () => () => doNothing)
      .stub(CliUx.ux.action, 'stop', () => doNothing)
      .command(['create schema', `-s ${schemaFile}`, `-d ${description}`])
      .it('runs create schema command', (ctx) => {
        expect(ctx.stdout).to.contain(mockSchemaDtoUnlisted.id)
        expect(ctx.stdout).to.contain(mockSchemaDtoUnlisted.authorDid)
        expect(ctx.stdout).to.contain(mockSchemaDtoUnlisted.jsonSchemaUrl)
        expect(ctx.stdout).to.contain(mockSchemaDtoUnlisted.jsonLdContextUrl)
      })
  })

  describe('Creating schema public', () => {
    test
      .nock(`${SCHEMA_MANAGER_URL}`, (api) =>
        api
          .get('/schemas?scope=public&skip=0&limit=1&type=schemaName&did=did:elem:AwesomeDID')
          .reply(StatusCodes.OK, mockSchemaDto),
      )
      .nock(`${SCHEMA_MANAGER_URL}`, (api) =>
        api.post('/schemas').reply(StatusCodes.OK, mockSchemaDtoOne),
      )
      .nock(`${ANALYTICS_URL}`, (api) => api.post('/api/events').reply(StatusCodes.CREATED))
      .stdout()
      .stub(authentication, 'isAuthenticated', () => true)
      .stub(prompts, 'enterSchemaName', () => async () => SCHEMA_NAME)
      .stub(fs.promises, 'readFile', () => '{"data":"some-data"}')
      .stub(CliUx.ux.action, 'start', () => () => doNothing)
      .stub(CliUx.ux.action, 'stop', () => doNothing)
      .command(['create schema', `-s ${schemaFile}`, `-d ${description}`, '--public=true'])
      .it('runs create schema command with public flag set to public', (ctx) => {
        expect(ctx.stdout).to.contain(mockSchemaDtoOne.id)
        expect(ctx.stdout).to.contain(mockSchemaDtoOne.authorDid)
        expect(ctx.stdout).to.contain(mockSchemaDtoOne.jsonSchemaUrl)
        expect(ctx.stdout).to.contain(mockSchemaDtoOne.jsonLdContextUrl)
      })
  })
  describe('Creating schema public when service is down', () => {
    test
      .nock(`${SCHEMA_MANAGER_URL}`, (api) =>
        api
          .get('/schemas?scope=public&skip=0&limit=1&type=schemaName&did=did:elem:AwesomeDID')
          .reply(StatusCodes.OK, mockSchemaDto),
      )
      .nock(`${SCHEMA_MANAGER_URL}`, (api) =>
        api.post('/schemas').reply(StatusCodes.INTERNAL_SERVER_ERROR),
      )
      .stdout()
      .stub(authentication, 'isAuthenticated', () => true)
      .stub(prompts, 'enterSchemaName', () => async () => SCHEMA_NAME)
      .stub(fs.promises, 'readFile', () => '{"data":"some-data"}')
      .stub(CliUx.ux.action, 'start', () => () => doNothing)
      .stub(CliUx.ux.action, 'stop', () => doNothing)
      .command(['create schema', `-s ${schemaFile}`, `-d ${description}`])
      .it('runs create schema command when service is down', (ctx) => {
        expect(ctx.stdout).to.contain(ServiceDownError)
      })
  })
  describe('Creating schema public when unauthorized', () => {
    test
      .stdout()
      .stub(prompts, 'enterSchemaName', () => async () => SCHEMA_NAME)
      .stub(fs.promises, 'readFile', () => '{"data":"some-data"}')
      .stub(CliUx.ux.action, 'start', () => () => doNothing)
      .stub(CliUx.ux.action, 'stop', () => doNothing)
      .command(['create schema', `-s ${schemaFile}`, `-d ${description}`])
      .it('runs create schema command when unauthorized', (ctx) => {
        expect(ctx.stdout).to.contain(Unauthorized)
      })
  })
  describe('Creating schema public with wrong file extension', () => {
    test

      .stdout()
      .stub(authentication, 'isAuthenticated', () => true)
      .stub(prompts, 'enterSchemaName', () => async () => SCHEMA_NAME)
      .stub(fs.promises, 'readFile', () => '{"data":"some-data"}')
      .stub(CliUx.ux.action, 'start', () => () => doNothing)
      .stub(CliUx.ux.action, 'stop', () => doNothing)
      .command(['create schema', `-s some/file`, `-d ${description}`])
      .it('runs create schema command and source flag contains invalid extension', (ctx) => {
        expect(ctx.stdout).to.contain(WrongSchemaFileType)
      })
  })
  describe('Bad request', () => {
    test
      .nock(`${SCHEMA_MANAGER_URL}`, (api) =>
        api
          .get('/schemas?scope=public&skip=0&limit=1&type=schemaName&did=did:elem:AwesomeDID')
          .reply(StatusCodes.OK, mockSchemaDto),
      )
      .nock(`${SCHEMA_MANAGER_URL}`, (api) => api.post('/schemas').reply(StatusCodes.BAD_REQUEST))
      .stdout()
      .stub(authentication, 'isAuthenticated', () => true)
      .stub(prompts, 'enterSchemaName', () => async () => SCHEMA_NAME)
      .stub(fs.promises, 'readFile', () => '{"data":"some-data"}')
      .stub(CliUx.ux.action, 'start', () => () => doNothing)
      .stub(CliUx.ux.action, 'stop', () => doNothing)
      .command(['create schema', `-s ${schemaFile}`, `-d ${description}`])
      .it('runs create schema command when json file contains invalid info', (ctx) => {
        expect(ctx.stdout).to.contain(schemaBadrequest)
      })
  })
  describe('Invalid Schema name', () => {
    test
      .stdout()
      .stub(authentication, 'isAuthenticated', () => true)
      .stub(prompts, 'enterSchemaName', () => async () => 'SCHEMA_NAME')
      .stub(CliUx.ux.action, 'start', () => () => doNothing)
      .stub(CliUx.ux.action, 'stop', () => doNothing)
      .command(['create schema', `-s ${schemaFile}`, `-d ${description}`])
      .it('runs create schema command given invalid schema name', (ctx) => {
        expect(ctx.stdout).to.contain(InvalidSchemaName)
      })
  })
})
