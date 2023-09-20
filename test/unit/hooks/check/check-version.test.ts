import { Hook } from '@oclif/core'
import { expect, test } from '@oclif/test'
import { CHECK_OPERATION, UnsupportedConfig } from '../../../../src/hooks/check/check-version'
import { configService } from '../../../../src/services'

describe('check-version hooks', function () {
  describe('Given no config.json file', function () {
    before(function () {
      configService.clear()
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
})
