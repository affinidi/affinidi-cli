import { CliUx, Command, Flags } from '@oclif/core'
import fs from 'fs/promises'

import { verfierService } from '../services/verification'

import { vaultService, VAULT_KEYS } from '../services/vault'
import { VerifyCredentialInput } from '../services/verification/verifier.api'

export default class VerifyVc extends Command {
  static description = 'Verfies a verifiable credential'

  static examples = ['<%= config.bin %> <%= command.id %>']

  static flags = {
    data: Flags.string({
      char: 'd',
      description: 'source json file with credentials to be verified',
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

  async catch(error: string | Error) {
    CliUx.ux.info(error.toString())
  }
}
