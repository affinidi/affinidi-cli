import { Command, Flags, CliUx } from '@oclif/core'
import fs from 'fs/promises'
import FormData from 'form-data'
import path from 'path'
import * as EmailValidator from 'email-validator'
import { StatusCodes } from 'http-status-codes'

import { parseSchemaURL } from '../services/issuance/parse.schema.url'
import { vaultService, VAULT_KEYS } from '../services'
import {
  CreateIssuanceInput,
  CreateIssuanceOfferInput,
  CreateIssuanceOutput,
  VerificationMethod,
} from '../services/issuance/issuance.api'
import { issuanceService } from '../services/issuance'
import { CliError, WrongEmailError, WrongFileType, getErrorOutput, Unauthorized } from '../errors'
import { enterIssuanceEmailPrompt } from '../user-actions'
import { getSession } from '../services/user-management'
import { EventDTO } from '../services/analytics/analytics.api'
import { analyticsService, generateUserMetadata } from '../services/analytics'
import { isAuthenticated } from '../middleware/authentication'

const MAX_EMAIL_ATTEMPT = 4

export default class IssueVc extends Command {
  static command = 'affinidi issue-vc'

  static usage = 'issue-vc [email] [FLAGS]'

  static description = 'Issues a verifiable credential based on an given schema.'

  static examples = ['<%= config.bin %> <%= command.id %>']

  static flags = {
    schema: Flags.string({ char: 's', description: 'json schema url', required: true }),
    data: Flags.string({
      char: 'd',
      description: 'the source file with credential data, either .json or .csv',
      required: true,
    }),
    bulk: Flags.boolean({
      char: 'b',
      description: 'defines that issuance happens in bulk',
      default: false,
    }),
    wallet: Flags.string({
      char: 'w',
      description: 'configure your own wallet to store VCs',
      default: 'https://wallet.affinidi.com/claim',
    }),
  }

  static args = [{ name: 'email', description: 'the email to whom the VC will be issued' }]

  public async run(): Promise<void> {
    const { flags, args } = await this.parse(IssueVc)
    if (!isAuthenticated()) {
      throw new CliError(Unauthorized, StatusCodes.UNAUTHORIZED, 'issuance')
    }
    const apiKeyHash = vaultService.get(VAULT_KEYS.projectAPIKey)
    const { schemaType, jsonSchema, jsonLdContext } = parseSchemaURL(flags.schema)
    const session = getSession()

    const issuanceJson: CreateIssuanceInput = {
      template: {
        walletUrl: flags.wallet,
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
    const fileExtension = flags.data.split('.').pop()
    let issuanceId: CreateIssuanceOutput
    if (flags.bulk && fileExtension === 'csv') {
      const file = await fs.readFile(flags.data)
      const formData = new FormData()
      formData.append('issuance', JSON.stringify(issuanceJson))
      formData.append('offers', file, {
        contentType: 'text/csv',
        filename: path.basename(flags.data),
      })
      CliUx.ux.action.start('Issuing VC')
      issuanceId = await issuanceService.createFromCsv(apiKeyHash, formData)
    } else if (!flags.bulk && fileExtension === 'json') {
      const file = await fs.readFile(flags.data, 'utf-8')
      let { email } = args
      let wrongEmailCount = 0
      while (!email || !EmailValidator.validate(email)) {
        // eslint-disable-next-line no-await-in-loop
        email = await enterIssuanceEmailPrompt()
        wrongEmailCount += 1
        if (wrongEmailCount === MAX_EMAIL_ATTEMPT) {
          CliUx.ux.error(WrongEmailError)
        }
      }
      const offerInput: CreateIssuanceOfferInput = {
        verification: {
          target: {
            email,
          },
        },
        credentialSubject: JSON.parse(file),
      }
      CliUx.ux.action.start('Issuing VC')
      issuanceId = await issuanceService.createIssuance(apiKeyHash, issuanceJson)
      await issuanceService.createOffer(apiKeyHash, issuanceId.id, offerInput)
    } else {
      const expectedExtension = flags.bulk ? '.csv' : '.json'
      CliUx.ux.error(`${WrongFileType}${expectedExtension} file`)
    }
    CliUx.ux.action.stop('')
    CliUx.ux.info(issuanceId.id)

    const analyticsData: EventDTO = {
      name: 'BULK_VC_ISSUED',
      category: 'APPLICATION',
      component: 'Cli',
      uuid: session?.account?.id,
      metadata: {
        commandId: 'affinidi.issue-vc',
        ...generateUserMetadata(session?.account?.label),
      },
    }
    await analyticsService.eventsControllerSend(analyticsData)
  }

  async catch(error: CliError) {
    CliUx.ux.action.stop('failed')
    CliUx.ux.info(getErrorOutput(error, IssueVc.command, IssueVc.usage, IssueVc.description))
  }
}
