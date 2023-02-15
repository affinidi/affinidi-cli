import { Hook } from '@oclif/core'
import { expect, test } from '@oclif/test'
import Sinon from 'sinon'

import { CHECK_OPERATION } from '../../../../src/hooks/check/checkVersion'
import { UnsupportedConfig } from '../../../../src/errors'
import * as config from '../../../../src/services/config'
import { createConfig } from '../../../../src/services/user-management'

const testUserId = '38efcc70-bbe1-457a-a6c7-b29ad9913648'
const testProjectId = 'random-test-project-id'

const unsuportedVersion = -1

describe('checkVersion hooks', () => {
  describe('Given no config.json file', () => {
    before(() => {
      config.configService.clear()
    })
    test
      .stdout()
      .hook('check', { id: CHECK_OPERATION.CONFIG })
      .do((output: { returned: Hook.Result<undefined> }) => {
        expect(output.returned.successes).to.have.lengthOf(0)
        expect(output.returned.failures).to.have.lengthOf(1)
      })
      .it(`shows an ${UnsupportedConfig} error message`)
  })

  describe('Given config.json file', () => {
    describe('And an unsuported version in the config file', () => {
      before(() => {
        Sinon.stub(config, 'getMajorVersion').returns(unsuportedVersion)
        createConfig({ userId: testUserId, projectId: testProjectId })
      })
      after(() => {
        Sinon.restore()
      })

      test
        .stdout()
        .hook('check', { id: CHECK_OPERATION.CONFIG })
        .do((output: { returned: Hook.Result<undefined> }) => {
          expect(output.returned.failures).to.have.lengthOf(1)
          const { error } = output.returned.failures.shift()
          expect(error.message).to.contain(UnsupportedConfig)
        })
        .it(`shows an ${UnsupportedConfig} error message`)
    })

    describe('And a suported version in the config file', () => {
      before(() => {
        createConfig({ userId: testUserId, projectId: testProjectId })
      })
      test
        .stdout()
        .hook('check', { id: CHECK_OPERATION.CONFIG })
        .do((output: { returned: Hook.Result<undefined> }) => {
          expect(output.returned.failures).to.have.lengthOf(0)
          expect(output.returned.successes).to.have.lengthOf(1)
        })
        .it(`shows an ${UnsupportedConfig} error message`)
    })
  })
})
