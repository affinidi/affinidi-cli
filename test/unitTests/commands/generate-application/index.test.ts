import { CliUx } from '@oclif/core'
import { expect, test } from '@oclif/test'
import { vaultService } from '../../../../src/services/vault/typedVaultService'
import { GitService, Writer, configService } from '../../../../src/services'
import {
  defaultAppName,
  Platforms,
  UseCasesAppNames,
} from '../../../../src/commands/generate-application'
import { NotSupportedPlatform } from '../../../../src/errors'
import { buildGeneratedAppNextStepsMessageBlocks } from '../../../../src/render/texts'
import * as authentication from '../../../../src/middleware/authentication'
import { projectSummary } from '../../../../src/fixtures/mock-projects'
import { createSession } from '../../../../src/services/user-management'

const doNothing = () => {}
const testUserId = '38efcc70-bbe1-457a-a6c7-b29ad9913648'
const testProjectId = 'random-test-project-id'

describe('generate-application command', () => {
  before(() => {
    vaultService.setActiveProject(projectSummary)
    createSession('test@email.com', testUserId, 'test-access-token')
    configService.create(testUserId, testProjectId)
    configService.optInOrOut(true)
  })
  after(() => {
    vaultService.clear()
  })
  describe('Given a non supported platform flag --platform mobile', () => {
    test
      .stdout()
      .stub(authentication, 'isAuthenticated', () => true)
      .command(['generate-application', '-p', Platforms.mobile])
      .it('it runs generate-application and shows a non platform supported message', (ctx) => {
        expect(ctx.stdout).to.contain(NotSupportedPlatform)
      })
  })

  describe('Given a non existing use-case', () => {
    test
      .stdout()
      .command(['generate-application', '-u', 'wrong-use-case'])
      .it('it runs generate-application and shows a invalid use-case message', (ctx) => {
        expect(ctx.stdout).to.contain('Expected --use-case=')
        expect(ctx.stdout).to.contain(`to be one of: ${Object.values(UseCasesAppNames).join(', ')}`)
      })
  })

  describe('Given no arguments', () => {
    const failError = new Error('it failed miserably')
    const fails = () => {
      throw failError
    }
    describe('When the git clone command fails', () => {
      test
        .stdout()
        .stub(authentication, 'isAuthenticated', () => true)
        .stub(GitService, 'clone', fails)
        .stub(CliUx.ux.action, 'start', () => () => doNothing)
        .stub(CliUx.ux.action, 'stop', () => doNothing)
        .command(['generate-application'])
        .it('it runs generate-application and shows a failing message', (ctx) => {
          expect(ctx.stdout).to.contain(
            `Failed to generate an application: Download Failed: ${failError.message}`,
          )
        })
    })

    describe('When the Writer write function fails', () => {
      test
        .stub(authentication, 'isAuthenticated', () => {
          return true
        })
        .stub(GitService, 'clone', doNothing)
        .stub(Writer, 'write', fails)
        .stub(CliUx.ux.action, 'start', () => () => doNothing)
        .stub(CliUx.ux.action, 'stop', () => doNothing)
        .stdout()
        .command(['generate-application'])
        .it('it runs generate-application and shows a failing message', (ctx) => {
          expect(ctx.stdout).to.contain(`Failed to set up project: ${failError.message}`)
        })
    })

    describe('When the GitService clone and Writer write functions work', () => {
      test
        .stdout()
        .stub(authentication, 'isAuthenticated', () => {
          return true
        })
        .stub(GitService, 'clone', doNothing)
        .stub(Writer, 'write', doNothing)
        .stub(CliUx.ux.action, 'start', () => () => doNothing)
        .stub(CliUx.ux.action, 'stop', () => doNothing)
        .command(['generate-application'])
        .it('it runs generate-application and shows the next steps long description', (ctx) => {
          buildGeneratedAppNextStepsMessageBlocks(
            defaultAppName,
            `${process.cwd()}/${defaultAppName}`,
            UseCasesAppNames.ticketingReferenceApp,
          )
            .map((b) => b.text)
            .forEach((msg) => {
              expect(ctx.stdout).to.contain(msg)
            })
        })
    })
  })
})
