import { SchemaDto, SearchSchemasOutputDto } from '../services/schema-manager/schema-manager.api'

export const mockSchemaDtoOne: SchemaDto = {
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
}

export const mockSchemaDtoTwo: SchemaDto = {
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
}

export const mockSchemaDto: SearchSchemasOutputDto = {
  schemas: [mockSchemaDtoOne, mockSchemaDtoTwo],
  count: 2,
}
