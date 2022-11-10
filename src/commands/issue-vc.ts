import { Command, Flags, CliUx } from '@oclif/core'
import fs from 'fs/promises'
import * as EmailValidator from 'email-validator'

import { parseSchemaURL } from '../services/issuance/parse.schema.url'
import { vaultService, VAULT_KEYS } from '../services'
import {
  CreateIssuanceInput,
  CreateIssuanceOfferInput,
  VerificationMethod,
} from '../services/issuance/issuance.api'
import { issuanceService } from '../services/issuance'
import { JsonFileSyntaxError, WrongEmailError } from '../errors'
import { getSession } from '../services/user-management'
import { enterIssuanceEmailPrompt } from '../user-actions'

const MAX_EMAIL_ATTEMPT = 3

export default class IssueVc extends Command {
  static description = 'Issues a verifiable credential based on an given schema'

  static examples = ['<%= config.bin %> <%= command.id %>']

  static flags = {
    schema: Flags.string({ char: 's', description: 'json schema url', required: true }),
    data: Flags.string({
      char: 'd',
      description: 'source json file with credential data',
      required: true,
    }),
  }

  static args = [{ name: 'email' }]

  public async run(): Promise<void> {
    const { flags, args } = await this.parse(IssueVc)

    let { email } = args
    if (!email) {
      email = await enterIssuanceEmailPrompt()
    }

    let wrongEmailCount = 0
    while (!EmailValidator.validate(email)) {
      // eslint-disable-next-line no-await-in-loop
      email = await enterIssuanceEmailPrompt()
      wrongEmailCount += 1
      if (wrongEmailCount === MAX_EMAIL_ATTEMPT) {
        CliUx.ux.error(WrongEmailError)
      }
    }
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
          email,
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
    if (error instanceof SyntaxError) {
      CliUx.ux.info(JsonFileSyntaxError.message)
    } else {
      CliUx.ux.info(error.toString())
    }
  }
}
