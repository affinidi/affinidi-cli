import { Command, Flags, CliUx } from '@oclif/core'
import fs from 'fs/promises'
import { parseSchemaURL } from '../services/issuance/parse.schema.url'
import { vaultService, VAULT_KEYS } from '../services'
import {
  CreateIssuanceInput,
  CreateIssuanceOfferInput,
  VerificationMethod,
} from '../services/issuance/issuance.api'
import { issuanceService } from '../services/issuance'
import { getSession } from '../services/user-management'

export default class IssueVc extends Command {
  static description = 'Issues a verifiable credential based on an given schema'

  static examples = ['<%= config.bin %> <%= command.id %>']

  static flags = {
    schema: Flags.string({ char: 's', description: 'json schema url' }),
    data: Flags.string({ char: 'd', description: 'source json file with credential data' }),
  }

  static args = [{ name: 'file' }]

  public async run(): Promise<void> {
    const { flags } = await this.parse(IssueVc)
    const token = getSession()?.accessToken
    const apiKeyHash = vaultService.get(VAULT_KEYS.projectAPIKey)

    const { schemaType, jsonSchema, jsonLdContext } = parseSchemaURL(flags.schema)

    const issuanceJson: CreateIssuanceInput = {
      template: {
        verification: {
          method: VerificationMethod.Email,
        },
        schema: {
          type: schemaType,
          jsonLdContextUrl: jsonLdContext.toString(),
          jsonSchemaUrl: jsonSchema.toString(),
        },
        issuerDid: vaultService.get(VAULT_KEYS.projectDID),
      },
      projectId: vaultService.get(VAULT_KEYS.projectId),
    }
    const file = await fs.readFile(flags.data, 'utf-8')
    const offerInput: CreateIssuanceOfferInput = {
      verification: {
        target: {
          email: VerificationMethod.Email,
        },
      },
      credentialSubject: JSON.parse(file),
    }
    CliUx.ux.action.start('Issuing VC')
    const issuanceId = await issuanceService.createIssuance(apiKeyHash, token, issuanceJson)
    const offer = await issuanceService.createOffer(apiKeyHash, token, issuanceId.id, offerInput)
    CliUx.ux.action.stop('')
    CliUx.ux.info(JSON.stringify(offer, null, '  '))
  }

  async catch(error: string | Error) {
    CliUx.ux.info(error.toString())
  }
}
