import { expect, test } from '@oclif/test'
import { PROJECTS, PROJECT_1 } from './constants'
import { clientSDK } from '../../../src/services/affinidi'

describe('affinidi auth', function () {
  test.it('#getActiveProject', () => {
    expect(clientSDK.auth.getActiveProject(PROJECTS)).to.deep.equal(PROJECT_1)
  })
})
