import { expect, test } from '@oclif/test'
import * as fs from 'fs'
import { testInbox } from './helpers'
import * as prompts from '../../src/user-actions'
import { vaultService } from '../../src/services/vault/typedVaultService'

// const keys = {
//   up: '\x1B\x5B\x41',
//   down: '\x1B\x5B\x42',
//   enter: '\x0D',
//   space: '\x20',
// }
// const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
const randomName = () => `Test Project ${Math.floor(Math.random() * 100)}`
const getCode = async (): Promise<string> => {
  const code = (await testInbox.waitForNewEmail()).body.split(' ').at(-1).replace('.', '')

  return code
}

describe('User Logs in, creates a new project and generates an application', () => {
  const projectNane = randomName()
  after(async () => {
    vaultService.clear()
    await fs.rmSync('./my-app', { recursive: true, force: true })
  })
  test
    .stdout()
    .stdin('\n', 10000)
    .stub(prompts, 'analyticsConsentPrompt', () => async () => prompts.AnswerNo)
    .stub(prompts, 'enterOTPPrompt', () => async () => getCode())
    .command(['login', `${testInbox.email}`])
    .command(['create project', `${projectNane}`])
    .command(['generate-application'])
    .it('list all projects of thqis account', async (ctx) => {
      expect(ctx.stdout).to.contains('Welcome back')
      expect(ctx.stdout).to.contains(projectNane)
      expect(ctx.stdout).to.contains('Successfully generated my-app at')
    })
})
