import { expect, test } from '@oclif/test'
import { configService } from '../../../../src/services'
import { clientSDK } from '../../../../src/services/affinidi'
import { IAM_URL } from '../../../../src/services/urls'

const testUserId = '38efcc70-bbe1-457a-a6c7-b29ad9913648'
const principalId = 'b2ce7675-5418-4058-b973-d254270de2d4'
const principalType = 'machine_user'
const getPoliciesApiResponse = {
  version: '2022-12-15',
  statement: [
    {
      principal: ['ari:iam::bd8d93df-4a2e-4c54-9400-3b94cc2664e4:machine_user/b2ce7675-5418-4058-b973-d254270de2d7'],
      action: [''],
      resource: [''],
      effect: 'Allow',
    },
  ],
}
describe('iam: commands', function () {
  describe('get-policies', function () {
    beforeEach(function () {
      configService.create(testUserId)
    })
    afterEach(function () {
      configService.clear()
      clientSDK.config.clear()
    })
    test
      .nock(IAM_URL, (api) =>
        api
          .get(`/v1/policies/principals/${principalId}?principalType=${principalType}`)
          .reply(200, getPoliciesApiResponse),
      )
      .stdout()
      .command(['iam get-policies', `--principal-id=${principalId}`, `--principal-type=${principalType}`])
      .it('Should return list of projects', (ctx) => {
        const response: any = JSON.parse(ctx.stdout)

        expect(response).to.have.a.property('version')
        expect(response).to.have.a.property('statement')
        expect(response?.statement).to.be.instanceOf(Array)
      })
  })
})
