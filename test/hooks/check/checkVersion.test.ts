import { Hook } from '@oclif/core'
import { expect, test } from '@oclif/test'
import Sinon from 'sinon'

import { UnsuportedConfig } from '../../../src/errors'
import * as config from '../../../src/services/config'
import { createConfig } from '../../../src/services/user-management'

const testUserId = '38efcc70-bbe1-457a-a6c7-b29ad9913648'
const testProjectId = 'random-test-project-id'

const unsuportedVersion = -1

describe('hooks', () => {
  describe('checkVersion', () => {
    describe('Given an unsuported version', () => {
      before(() => {
        Sinon.stub(config, 'getMajorVersion').returns(unsuportedVersion)
        createConfig({ userId: testUserId, projectId: testProjectId })
      })
      after(() => {
        Sinon.restore()
      })

      test
        .stdout()
        .hook('check', { id: 'sign-up' })
        .do((output: { returned: Hook.Result<undefined> }) => {
          expect(output.returned.failures).to.have.lengthOf(1)
          const { error } = output.returned.failures.shift()
          expect(error.message).to.contain(UnsuportedConfig)
        })
        .it(`shows an ${UnsuportedConfig} error message`)
    })

    describe('Given an suported version', () => {
      before(() => {
        createConfig({ userId: testUserId, projectId: testProjectId })
      })
      test
        .stdout()
        .hook('check', { id: 'sign-up' })
        .do((output: { returned: Hook.Result<undefined> }) => {
          expect(output.returned.failures).to.have.lengthOf(0)
          expect(output.returned.successes).to.have.lengthOf(1)
        })
        .it(`shows an ${UnsuportedConfig} error message`)
    })
  })
})
