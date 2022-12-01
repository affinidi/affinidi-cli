import { CliUx, Command, Flags } from '@oclif/core'
import fs from 'fs/promises'
import { StatusCodes } from 'http-status-codes'

import { verfierService } from '../services/verification'

import { vaultService, VAULT_KEYS } from '../services/vault'
import { VerifyCredentialInput } from '../services/verification/verifier.api'
import { CliError, getErrorOutput, JsonFileSyntaxError, Unauthorized } from '../errors'
import { EventDTO } from '../services/analytics/analytics.api'
import { analyticsService, generateUserMetadata } from '../services/analytics'
import { getSession } from '../services/user-management'
import { anonymous } from '../constants'
import { isAuthenticated } from '../middleware/authentication'
import { displayOutput } from '../middleware/display'
import { configService } from '../services/config'

export default class VerifyVc extends Command {
  static command = 'affinidi verify-vc'

  static usage = 'verify-vc [FLAGS]'

  static description = 'Verfies a verifiable credential.'

  static examples = ['<%= config.bin %> <%= command.id %>']

  static flags = {
    data: Flags.string({
      char: 'd',
      description: 'source JSON file with credentials to be verified',
      required: true,
    }),
    view: Flags.enum<'plaintext' | 'json' | 'json-file'>({
      char: 'v',
      options: ['plaintext', 'json', 'json-file'],
      description: 'set flag to override default output format view',
    }),
  }

  public async run(): Promise<void> {
    const { flags } = await this.parse(VerifyVc)
    if (!isAuthenticated()) {
      throw new CliError(Unauthorized, StatusCodes.UNAUTHORIZED, 'verifier')
    }
    const session = getSession()
    const apiKey = vaultService.get(VAULT_KEYS.projectAPIKey)

    const credentialData = await fs.readFile(flags.data, 'utf-8')
    CliUx.ux.action.start('verifying')
    const verifyCredentialInput: VerifyCredentialInput = JSON.parse(credentialData)
    const verification = await verfierService.verifyVC(apiKey, verifyCredentialInput)
    CliUx.ux.action.stop()
    const analyticsData: EventDTO = {
      name: 'VC Verified',
      category: 'APPLICATION',
      component: 'Cli',
      uuid: session ? configService.getCurrentUser() : anonymous,
      metadata: {
        commandId: 'affinidi.verify-vc',
        ...generateUserMetadata(session?.account?.label),
      },
    }
    await analyticsService.eventsControllerSend(analyticsData)
    displayOutput(JSON.stringify(verification, null, ' '), flags.view)
  }

  async catch(error: CliError) {
    CliUx.ux.action.stop('failed')
    const err = error
    if (error instanceof SyntaxError) {
      err.message = JsonFileSyntaxError
    }
    const outputFormat = configService.getOutputFormat()
    CliUx.ux.info(
      getErrorOutput(
        error,
        VerifyVc.command,
        VerifyVc.usage,
        VerifyVc.description,
        outputFormat !== 'plaintext',
      ),
    )
  }
}
