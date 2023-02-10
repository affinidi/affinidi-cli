import { ux, Command, Flags } from '@oclif/core'
import fs from 'fs/promises'
import { StatusCodes } from 'http-status-codes'

import { verfierService } from '../services/verification'

import { vaultService } from '../services/vault/typedVaultService'
import { VerifyCredentialInput } from '../services/verification/verifier.api'
import {
  CliError,
  getErrorOutput,
  JsonFileSyntaxError,
  Unauthorized,
  WrongSchemaFileType,
} from '../errors'
import { EventDTO } from '../services/analytics/analytics.api'
import { analyticsService, generateUserMetadata } from '../services/analytics'
import { getSession } from '../services/user-management'
import { isAuthenticated } from '../middleware/authentication'
import { DisplayOptions, displayOutput } from '../middleware/display'
import { configService } from '../services/config'
import { checkErrorFromWizard } from '../wizard/helpers'
import { output } from '../customFlags/outputFlag'

export default class VerifyVc extends Command {
  static command = 'affinidi verify-vc'

  static usage = 'verify-vc [FLAGS]'

  static description = 'Use this command to verify a verifiable credential.'

  static examples = ['<%= config.bin %> <%= command.id %>']

  static flags = {
    data: Flags.string({
      char: 'd',
      description: 'source JSON file with credentials to be verified',
      required: true,
    }),
    output,
  }

  public async run(): Promise<void> {
    const { flags } = await this.parse(VerifyVc)
    if (!isAuthenticated()) {
      throw new CliError(Unauthorized, StatusCodes.UNAUTHORIZED, 'verifier')
    }
    const { account } = getSession()
    const activeProject = vaultService.getActiveProject()
    const apiKey = activeProject.apiKey.apiKeyHash
    if (!(flags.data.split('.').pop() === 'json')) {
      throw new Error(WrongSchemaFileType)
    }
    const credentialData = await fs.readFile(flags.data, 'utf-8')
    ux.action.start('verifying')
    const verifyCredentialInput: VerifyCredentialInput = JSON.parse(credentialData)
    const verification = await verfierService.verifyVC(apiKey, verifyCredentialInput)
    ux.action.stop()
    const analyticsData: EventDTO = {
      name: 'VC Verified',
      category: 'APPLICATION',
      component: 'Cli',
      uuid: account.userId,
      metadata: {
        commandId: 'affinidi.verify-vc',
        ...generateUserMetadata(account.label),
      },
    }
    await analyticsService.eventsControllerSend(analyticsData)
    displayOutput({ itemToDisplay: JSON.stringify(verification, null, ' '), flag: flags.output })
  }

  async catch(error: CliError) {
    const err = error
    if (error instanceof SyntaxError) {
      err.message = JsonFileSyntaxError
    }
    if (checkErrorFromWizard(err)) throw err
    const outputFormat = configService.getOutputFormat()
    const optionsDisplay: DisplayOptions = {
      itemToDisplay: getErrorOutput(
        error,
        VerifyVc.command,
        VerifyVc.usage,
        VerifyVc.description,
        outputFormat !== 'plaintext',
      ),
      err: true,
    }
    try {
      const { flags } = await this.parse(VerifyVc)
      optionsDisplay.flag = flags.output
      displayOutput(optionsDisplay)
    } catch (_) {
      displayOutput(optionsDisplay)
    }
  }
}
