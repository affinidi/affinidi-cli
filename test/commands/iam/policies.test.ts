import { expect, test } from '@oclif/test'
import { config } from '../../../src/services/env-config'

const IAM_URL = `${config.bffHost}/iam`
const principalId = 'b2ce7675-5418-4058-b973-d254270de2d4'
const principalType = 'token'
const getPoliciesApiResponse = {
  version: '2022-12-15',
  statement: [
    {
      principal: ['ari:iam::bd8d93df-4a2e-4c54-9400-3b94cc2664e4:token/b2ce7675-5418-4058-b973-d254270de2d7'],
      action: [''],
      resource: [''],
      effect: 'Allow',
    },
  ],
}
describe('iam: commands', function () {
  describe('get-policies', function () {
    test
      .nock(IAM_URL, (api) =>
        api
          .get(`/v1/policies/principals/${principalId}?principalType=${principalType}`)
          .reply(200, getPoliciesApiResponse),
      )
      .stdout()
      .command(['iam get-policies', `--principal-id=${principalId}`, `--principal-type=${principalType}`])
      .it('Should return list of projects', (ctx) => {
        const response = JSON.parse(ctx.stdout)

        expect(response).to.have.a.property('version')
        expect(response).to.have.a.property('statement')
        expect(response?.statement).to.be.instanceOf(Array)
      })
  })
})
