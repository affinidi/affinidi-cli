import { UpdateConfigurationByIdInput, IotaConfigurationDto } from '@affinidi-tdk/iota-client'
import { ux, Flags } from '@oclif/core'
import { CLIError } from '@oclif/core/errors'
import z from 'zod'
import { BaseCommand } from '../../common/base-command.js'
import { giveFlagInputErrorMessage } from '../../common/error-messages.js'
import { promptRequiredParameters } from '../../common/prompts.js'
import { INPUT_LIMIT } from '../../common/validators.js'
import { iotaService } from '../../services/affinidi/iota/service.js'

export class UpdateIotaConfig extends BaseCommand<typeof UpdateIotaConfig> {
  static summary = 'Updates Iota configuration in your active project'
  static examples = [
    '<%= config.bin %> <%= command.id %> -i <value>',
    '<%= config.bin %> <%= command.id %> --id <value>',
  ]
  static flags = {
    id: Flags.string({
      char: 'i',
      summary: 'ID of the Iota configuration',
    }),
    name: Flags.string({
      char: 'n',
      summary: 'Name of the Iota configuration',
    }),
    description: Flags.string({
      char: 'd',
      summary: 'Description of the Iota configuration',
    }),
    'wallet-ari': Flags.string({
      summary: 'ARI of the wallet',
    }),
    'token-max-age': Flags.integer({
      summary: 'Token expiration time in seconds - integer between 1 and 10',
    }),
    'response-webhook-url': Flags.string({
      summary: 'Iota response webhook URL',
    }),
    'enable-verification': Flags.boolean({
      summary: 'Perform verification',
    }),
    'enable-consent-audit-log': Flags.boolean({
      summary: 'Log consents',
    }),
    'client-name': Flags.string({
      summary: 'Name, displayed in the consent page',
    }),
    'client-origin': Flags.string({
      summary: 'Domain, displayed in the consent page',
    }),
    'client-logo': Flags.string({
      summary: 'Application URL of a logo, displayed in the consent page',
    }),
  }

  public async run(): Promise<IotaConfigurationDto> {
    const { flags } = await this.parse(UpdateIotaConfig)
    const promptFlags = await promptRequiredParameters(['id'], flags)

    if (flags['no-input']) {
      if (!flags.id) throw new CLIError(giveFlagInputErrorMessage('id'))
    }

    const flagsSchema = z.object({ id: z.string().max(INPUT_LIMIT).uuid() })
    const validatedFlags = flagsSchema.parse(promptFlags)

    const data: UpdateConfigurationByIdInput = {
      name: promptFlags.name ?? undefined,
      description: promptFlags.description ?? undefined,
      walletAri: promptFlags['wallet-ari'] ?? undefined,
      iotaResponseWebhookURL: promptFlags['response-webhook-url'] ?? undefined,
      enableVerification: promptFlags['enable-verification'] ?? undefined,
      enableConsentAuditLog: promptFlags['enable-consent-audit-log'] ?? undefined,
      tokenMaxAge: promptFlags['token-max-age'] ?? undefined,
    }

    if (promptFlags['client-name'] || promptFlags['client-origin'] || promptFlags['client-logo']) {
      data.clientMetadata = {
        name: promptFlags['client-name'] ?? undefined,
        origin: promptFlags['client-origin'] ?? undefined,
        logo: promptFlags['client-logo'] ?? undefined,
      }
    }

    const schema = z.object({
      name: z.string().max(INPUT_LIMIT).optional(),
      description: z.string().max(INPUT_LIMIT).optional(),
      walletAri: z.string().min(1).max(INPUT_LIMIT).optional(),
      enableVerification: z.boolean().optional(),
      enableConsentAuditLog: z.boolean().optional(),
      tokenMaxAge: z.number().min(1).max(10).optional(),
      iotaResponseWebhookURL: z.string().max(INPUT_LIMIT).optional(),
      clientMetadata: z
        .object({
          name: z.string().max(INPUT_LIMIT),
          origin: z.string().max(INPUT_LIMIT),
          logo: z.string().max(INPUT_LIMIT),
        })
        .optional(),
    })
    const configInput = schema.parse(data)

    ux.action.start('Updating Iota configurations')
    const output = await iotaService.updateIotaConfigById(validatedFlags.id, configInput)
    ux.action.stop('Updated successfully!')

    if (!this.jsonEnabled()) this.logJson(output)
    return output
  }
}
