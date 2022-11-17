import { CliUx, Command, Flags } from '@oclif/core'
import fs from 'fs/promises'

import { verfierService } from '../services/verification'

import { vaultService, VAULT_KEYS } from '../services/vault'
import { VerifyCredentialInput } from '../services/verification/verifier.api'
import { CliError, getErrorOutput } from '../errors'

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
  }

  public async run(): Promise<void> {
    const { flags } = await this.parse(VerifyVc)

    const apiKey = vaultService.get(VAULT_KEYS.projectAPIKey)

    const credentialData = await fs.readFile(flags.data, 'utf-8')
    const verifyCredentialInput: VerifyCredentialInput = JSON.parse(credentialData)
    const verification = await verfierService.verifyVC(apiKey, verifyCredentialInput)
    CliUx.ux.info(JSON.stringify(verification, null, ' '))
  }

  async catch(error: CliError) {
    CliUx.ux.action.stop('failed')
    CliUx.ux.info(getErrorOutput(error, VerifyVc.command, VerifyVc.usage, VerifyVc.description))
  }
}
