import { expect, test } from '@oclif/test'
import { FancyTypes } from 'fancy-test'
import { StatusCodes } from 'http-status-codes'

import { ANALYTICS_URL } from '../../../src/services/analytics'
import { mockSchemaDto } from '../../../src/fixtures/mock-schemas'
import { SCHEMA_MANAGER_URL } from '../../../src/services/schema-manager'
import { configService } from '../../../src/services'
import { vaultService } from '../../../src/services/vault/typedVaultService'
import { projectSummary } from '../../../src/fixtures/mock-projects'

const testUserId = '38efcc70-bbe1-457a-a6c7-b29ad9913648'
const testProjectId = projectSummary.project.projectId
// const testProjectDid = projectSummary.wallet.did

const getSchemasOK = async (api: FancyTypes.NockScope) =>
  api.get(`/schemas?scope=default&skip=0&limit=10`).reply(StatusCodes.OK, mockSchemaDto)

describe('list schemas command', () => {
  before(() => {
    configService.create(testUserId, testProjectId)
    configService.optInOrOut(true)
    vaultService.setActiveProject(projectSummary)
  })
  after(() => {
    configService.clear()
    vaultService.clear()
  })
  describe('--view json', () => {
    test
      .nock(SCHEMA_MANAGER_URL, getSchemasOK)
      .stdout()
      .command(['list schemas'])
      .it('runs list schemas and shows schemas in json format', (ctx) => {
        expect(ctx.stdout).to.contain(mockSchemaDto.schemas[0].id)
        expect(ctx.stdout).to.contain(mockSchemaDto.schemas[1].id)
      })

    test
      .nock(SCHEMA_MANAGER_URL, getSchemasOK)
      .stdout()
      .command(['list schemas', '-o', 'json'])
      .it('runs list schemas -o json and shows schemas in json format', (ctx) => {
        expect(() => JSON.parse(ctx.stdout)).not.to.throw()
      })

    test
      .nock(SCHEMA_MANAGER_URL, getSchemasOK)
      .stdout()
      .command(['list schemas', '--output', 'json'])
      .it('runs list schemas --output json and shows schemas in json format', (ctx) => {
        expect(() => JSON.parse(ctx.stdout)).not.to.throw()
      })
  })

  describe('--view table', () => {
    const tableHeaders = ['ID', 'DESC', 'Version', 'Type']
    test
      .nock(SCHEMA_MANAGER_URL, getSchemasOK)
      .stdout()
      .command(['list schemas', '-o', 'table'])
      .it('runs list schemas -o table and shows a table with different schemas', (ctx) => {
        expect(() => JSON.parse(ctx.stdout)).to.throw()
        tableHeaders.map((h) => expect(ctx.stdout).to.contain(h))
      })

    test
      .nock(SCHEMA_MANAGER_URL, getSchemasOK)
      .stdout()
      .command(['list schemas', '--output', 'table'])
      .it('runs list schemas --output table and shows a table with different schemas', (ctx) => {
        expect(() => JSON.parse(ctx.stdout)).to.throw()
        tableHeaders.map((h) => expect(ctx.stdout).to.contain(h))
      })
  })
})
