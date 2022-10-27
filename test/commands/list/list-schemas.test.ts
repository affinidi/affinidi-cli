import { expect, test } from '@oclif/test'
import { FancyTypes } from 'fancy-test'
import { StatusCodes } from 'http-status-codes'

import { SearchSchemasOutputDto } from '../../../src/services/schema-manager/schema-manager.api'
import { SCHEMA_MANAGER_URL } from '../../../src/services/schema-manager'

const mockSchemaDto: SearchSchemasOutputDto = {
  schemas: [
    {
      id: 'CealBusinessCardV1-0',
      parentId: null,
      authorDid: 'did:elem:EiBuV4NncamCHukI0klDajvzbZBk-Dgctc9JpC5SZTczZw',
      description: 'Business Card VC for Ceal App',
      createdAt: '2022-10-27T02:51:38.997Z',
      namespace: null,
      type: 'CealBusinessCard',
      version: 1,
      revision: 0,
      jsonSchemaUrl: 'https://schema.affinidi.com/CealBusinessCardV1-0.json',
      jsonLdContextUrl: 'https://schema.affinidi.com/CealBusinessCardV1-0.jsonld',
    },
    {
      id: 'LeadershipWorkshopBadgeV1-0',
      parentId: 'LEAPBadgeV1-0',
      authorDid: 'did:elem:EiDsLbVSR79FLxY33rkJb3DzwPcpLczj2Iob4ci26npccA',
      description: 'Leadership Workshop Badge',
      createdAt: '2022-10-25T14:19:38.435Z',
      namespace: null,
      type: 'LeadershipWorkshopBadge',
      version: 1,
      revision: 0,
      jsonSchemaUrl: 'https://schema.affinidi.com/LeadershipWorkshopBadgeV1-0.json',
      jsonLdContextUrl: 'https://schema.affinidi.com/LeadershipWorkshopBadgeV1-0.jsonld',
    },
  ],
  count: 2,
}

const getSchemasOK = async (api: FancyTypes.NockScope) =>
  api.get('/schemas?skip=0&limit=10&scope=default').reply(StatusCodes.OK, mockSchemaDto)

describe('list schemas command', () => {
  describe('--output json', () => {
    test
      .nock(`${SCHEMA_MANAGER_URL}`, getSchemasOK)
      .stdout()
      .command(['list schemas'])
      .it('runs list schemas and shows schemas in json format', (ctx) => {
        expect(() => JSON.parse(ctx.stdout)).not.to.throw()
      })

    test
      .nock(`${SCHEMA_MANAGER_URL}`, getSchemasOK)
      .stdout()
      .command(['list schemas', '-o', 'json'])
      .it('runs list schemas -o json and shows schemas in json format', (ctx) => {
        expect(() => JSON.parse(ctx.stdout)).not.to.throw()
      })

    test
      .nock(`${SCHEMA_MANAGER_URL}`, getSchemasOK)
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
      .stdout()
      .command(['list schemas', '-o', 'table'])
      .it('runs list schemas -o table and shows a table with different schemas', (ctx) => {
        expect(() => JSON.parse(ctx.stdout)).to.throw()
        tableHeaders.map((h) => expect(ctx.stdout).to.contain(h))
      })

    test
      .nock(`${SCHEMA_MANAGER_URL}`, getSchemasOK)
      .stdout()
      .command(['list schemas', '--output', 'table'])
      .it('runs list schemas --output table and shows a table with different schemas', (ctx) => {
        expect(() => JSON.parse(ctx.stdout)).to.throw()
        tableHeaders.map((h) => expect(ctx.stdout).to.contain(h))
      })
  })
})
