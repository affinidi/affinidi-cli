import { runCommand } from '@oclif/test'
import { expect } from 'chai'
import nock from 'nock'

import { config } from '../../../src/services/env-config.js'

const AIS_URL = `${config.bffHost}/ais`

const configurationId = '8740f97f-d5cb-4fdb-af23-4c769cfed3ab'
const pexQueryFilePath = 'test/helpers/phone-pex-query.json'

const pexQuery = {
  ari: 'ari:iota_service:ap-southeast-1:940e8684-55b3-4d41-8e3d-cd329e9f22f2:query/790a97ee-35eb-4e0e-84d1-357ae94d1cb6',
  name: 'Test',
  description: '',
  createdAt: '2024-08-15T08:19:42.026Z',
  modifiedAt: '2024-08-15T08:19:42.026Z',
  createdBy: 'user/1c71597a-372f-4468-a434-7c0e6288ee86',
  modifiedBy: 'user/1c71597a-372f-4468-a434-7c0e6288ee86',
  configurationAri:
    'ari:iota_service:ap-southeast-1:940e8684-55b3-4d41-8e3d-cd329e9f22f2:iota_configuration/8740f97f-d5cb-4fdb-af23-4c769cfed3ab',
  vpDefinition:
    '{\n  "id": "token_with_contact_vc",\n  "input_descriptors": [\n    {\n      "id": "profile_phone",\n      "name": "Contact VC",\n      "purpose": "Check if Vault contains the required VC.",\n      "constraints": {\n        "fields": [\n          {\n            "path": [\n              "$.type"\n            ],\n            "purpose": "Check if VC type is correct",\n            "filter": {\n              "type": "array",\n              "contains": {\n                "type": "string",\n                "pattern": "^HITPhoneNumber$"\n              }\n            }\n          },\n          {\n            "path": [\n              "$.credentialSubject.phoneNumber"\n            ]\n          }\n        ]\n      }\n    }\n  ]\n}',
  queryId: '790a97ee-35eb-4e0e-84d1-357ae94d1cb6',
}

describe('iota: queries commands', function () {
  describe('iota:create-query', () => {
    it('creates a PEX query and outputs its info', async () => {
      nock(AIS_URL).post(`/v1/configurations/${configurationId}/pex-queries`).reply(200, pexQuery)
      const { stdout } = await runCommand([
        'iota:create-query',
        `--configuration-id=${configurationId}`,
        `--name=${pexQuery.name}`,
        `--description=${pexQuery.description}`,
        `--file=${pexQueryFilePath}`,
        '--no-input',
        '--json',
      ])
      const response = JSON.parse(stdout)
      expect(response).to.have.a.property('ari')
      expect(response).to.have.a.property('name')
      expect(response).to.have.a.property('description')
      expect(response).to.have.a.property('configurationAri')
      expect(response).to.have.a.property('vpDefinition')
      expect(response).to.have.a.property('queryId')
    })
  })

  describe('iota:get-query', () => {
    it('outputs PEX query info based on query ID', async () => {
      nock(AIS_URL).get(`/v1/configurations/${configurationId}/pex-queries/${pexQuery.queryId}`).reply(200, pexQuery)
      const { stdout } = await runCommand([
        'iota:get-query',
        `--configuration-id=${configurationId} --query-id=${pexQuery.queryId}`,
      ])
      const response = JSON.parse(stdout)
      expect(response).to.have.a.property('ari')
      expect(response).to.have.a.property('name')
      expect(response).to.have.a.property('description')
      expect(response).to.have.a.property('configurationAri')
      expect(response).to.have.a.property('vpDefinition')
      expect(response).to.have.a.property('queryId')
    })
  })

  describe('iota:list-queries', () => {
    it('outputs the list of PEX queries', async () => {
      nock(AIS_URL)
        .get(`/v1/configurations/${configurationId}/pex-queries`)
        .reply(200, {
          pexQueries: [pexQuery],
        })
      const { stdout } = await runCommand([`iota:list-queries --configuration-id=${configurationId}`])
      const { pexQueries: response } = JSON.parse(stdout)
      expect(response[0]).to.have.a.property('ari')
      expect(response[0]).to.have.a.property('name')
      expect(response[0]).to.have.a.property('description')
      expect(response[0]).to.have.a.property('configurationAri')
      expect(response[0]).to.have.a.property('vpDefinition')
      expect(response[0]).to.have.a.property('queryId')
    })
  })

  describe('iota:update-query', () => {
    it('updates PEX query', async () => {
      nock(AIS_URL).patch(`/v1/configurations/${configurationId}/pex-queries/${pexQuery.queryId}`).reply(200, pexQuery)

      const { stdout } = await runCommand([
        'iota:update-query',
        `--configuration-id=${configurationId}`,
        `--query-id=${pexQuery.queryId}`,
        `--file=${pexQueryFilePath}`,
        `--description=${pexQuery.description}`,
      ])
      const response = JSON.parse(stdout)
      expect(response).to.have.a.property('ari')
      expect(response).to.have.a.property('name')
      expect(response).to.have.a.property('description')
      expect(response).to.have.a.property('configurationAri')
      expect(response).to.have.a.property('vpDefinition')
      expect(response).to.have.a.property('queryId')
    })
  })

  describe('iota:delete-query', () => {
    it('deletes PEX query', async () => {
      nock(AIS_URL).delete(`/v1/configurations/${configurationId}/pex-queries/${pexQuery.queryId}`).reply(200)
      const { stdout } = await runCommand([
        'iota:delete-query',
        `--configuration-id=${configurationId} --query-id=${pexQuery.queryId}`,
      ])
      const response = JSON.parse(stdout)
      expect(response).to.have.a.property('queryId')
    })
  })
})
