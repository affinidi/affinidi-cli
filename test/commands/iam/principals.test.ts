import { expect, test } from '@oclif/test'
import { config } from '../../../src/services/env-config'

// TODO: Extract the mocked data in a shared folder, remove mock duplicates if any.

const IAM_URL = `${config.bffHost}/iam`
const principalId = 'b2ce7675-5418-4058-b973-d254270de2d4'
const principalType = 'token'
const listPrincipalsApiResponse = {
  records: [
    {
      projectId: 'd99d6d39-c9ba-4970-99ca-f8758eb8a9d3',
      projectName: 'Default Project',
      principalId: 'token/b2ce7675-5418-4058-b973-d254270de2d4',
      version: '2022-12-15',
      statement: [
        {
          principal: ['ari:iam::d99d6d39-c9ba-4970-99ca-f8758eb8a9d3:token/b2ce7675-5418-4058-b973-d254270de2d4'],
          action: [''],
          resource: [''],
          effect: 'Allow',
        },
      ],
    },
  ],
}

describe('iam: commands', function () {
  describe('add-principal', function () {
    test
      .nock(IAM_URL, (api) => api.post('/v1/projects/principals').reply(200))
      .stdout()
      .command(['iam add-principal', `--principal-id=${principalId}`, `--principal-type=${principalType}`])
      .it('Adds a principal (user or token) to the active project')
  })

  describe('list-principals', function () {
    test
      .nock(IAM_URL, (api) => api.get('/v1/projects/principals').reply(200, listPrincipalsApiResponse))
      .stdout()
      .command(['iam list-principals'])
      .it('Should return list of projects', (ctx) => {
        const response = JSON.parse(ctx.stdout)
        expect(response).to.have.a.property('records')
        expect(response?.records).to.be.instanceOf(Array)
        expect(response?.records).to.have.length.greaterThanOrEqual(1)

        for (const record of response.records) {
          expect(record).to.have.a.property('projectId')
          expect(record).to.have.a.property('projectName')
          expect(record).to.have.a.property('principalId')
          expect(record).to.have.a.property('version')
          expect(record).to.have.a.property('statement')
        }
      })
  })

  describe('remove-principal', function () {
    test
      .nock(IAM_URL, (api) =>
        api.delete(`/v1/projects/principals/${principalId}?principalType=${principalType}`).reply(200),
      )
      .stdout()
      .command(['iam remove-principal', `--principal-id=${principalId}`, `--principal-type=${principalType}`])
      .it('Does nothing when user has a single project.', (ctx) => {
        const response = JSON.parse(ctx.stdout)
        expect(response).to.have.a.property('principal-id')
        expect(response).to.have.a.property('principal-type')
        expect(response['principal-id']).to.be.equal(principalId)
        expect(response['principal-type']).to.be.equal('token')
      })
  })
})
