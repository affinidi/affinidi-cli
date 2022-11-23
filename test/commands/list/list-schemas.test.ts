import { expect, test } from '@oclif/test'
import { FancyTypes } from 'fancy-test'
import { StatusCodes } from 'http-status-codes'

import { ANALYTICS_URL } from '../../../src/services/analytics'
import { mockSchemaDto } from '../../../src/fixtures/mock-schemas'
import { SCHEMA_MANAGER_URL } from '../../../src/services/schema-manager'

const getSchemasOK = async (api: FancyTypes.NockScope) =>
  api
    .get('/schemas?skip=0&limit=10&scope=default&did=did:elem:AwesomeDID')
    .reply(StatusCodes.OK, mockSchemaDto)

describe('list schemas command', () => {
  describe('--output json', () => {
    test
      .nock(`${SCHEMA_MANAGER_URL}`, getSchemasOK)
      .nock(`${ANALYTICS_URL}`, (api) => api.post('/api/events').reply(StatusCodes.CREATED))
      .stdout()
      .command(['list schemas'])
      .it('runs list schemas and shows schemas in json format', (ctx) => {
        expect(() => JSON.parse(ctx.stdout)).not.to.throw()
      })

    test
      .nock(`${SCHEMA_MANAGER_URL}`, getSchemasOK)
      .nock(`${ANALYTICS_URL}`, (api) => api.post('/api/events').reply(StatusCodes.CREATED))
      .stdout()
      .command(['list schemas', '-o', 'json'])
      .it('runs list schemas -o json and shows schemas in json format', (ctx) => {
        expect(() => JSON.parse(ctx.stdout)).not.to.throw()
      })

    test
      .nock(`${SCHEMA_MANAGER_URL}`, getSchemasOK)
      .nock(`${ANALYTICS_URL}`, (api) => api.post('/api/events').reply(StatusCodes.CREATED))
      .stdout()
      .command(['list schemas', '--output', 'json'])
      .it('runs list schemas --output json and shows schemas in json format', (ctx) => {
        expect(() => JSON.parse(ctx.stdout)).not.to.throw()
      })
  })

  describe('--output table', () => {
    const tableHeaders = ['ID', 'DESC', 'Version', 'Type']
    test
      .nock(`${SCHEMA_MANAGER_URL}`, getSchemasOK)
      .nock(`${ANALYTICS_URL}`, (api) => api.post('/api/events').reply(StatusCodes.CREATED))
      .stdout()
      .command(['list schemas', '-o', 'table'])
      .it('runs list schemas -o table and shows a table with different schemas', (ctx) => {
        expect(() => JSON.parse(ctx.stdout)).to.throw()
        tableHeaders.map((h) => expect(ctx.stdout).to.contain(h))
      })

    test
      .nock(`${SCHEMA_MANAGER_URL}`, getSchemasOK)
      .nock(`${ANALYTICS_URL}`, (api) => api.post('/api/events').reply(StatusCodes.CREATED))
      .stdout()
      .command(['list schemas', '--output', 'table'])
      .it('runs list schemas --output table and shows a table with different schemas', (ctx) => {
        expect(() => JSON.parse(ctx.stdout)).to.throw()
        tableHeaders.map((h) => expect(ctx.stdout).to.contain(h))
      })
  })
})
