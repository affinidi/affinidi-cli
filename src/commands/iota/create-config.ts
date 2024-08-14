import { CreateIotaConfigurationInput, IotaConfigurationDto } from '@affinidi-tdk/iota-client'
import { input, select, confirm, number } from '@inquirer/prompts'
import { ux, Flags } from '@oclif/core'
import { CLIError } from '@oclif/core/errors'
import z from 'zod'
import { BaseCommand } from '../../common/base-command.js'
import { DidMethods } from '../../common/constants.js'
import { giveFlagInputErrorMessage } from '../../common/error-messages.js'
import { INPUT_LIMIT, validateInputLength } from '../../common/validators.js'
import { cweService } from '../../services/affinidi/cwe/service.js'
import { iotaService } from '../../services/affinidi/iota/service.js'

export class CreateIotaConfig extends BaseCommand<typeof CreateIotaConfig> {
  static summary = 'Creates Iota configuration in your active project'
  static examples = [
    '<%= config.bin %> <%= command.id %> --name <value> --wallet-ari <value>',
    '<%= config.bin %> <%= command.id %> --name <value> --wallet-ari <value> --enable-consent-audit-log <value> --enable-verification <value> --token-max-age <value>',
  ]
  static flags = {
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
      summary: 'Token expiration time in minutes - integer between 1 and 10',
      default: 10,
    }),
    'response-webhook-url': Flags.string({
      summary: 'Iota response webhook URL',
    }),
    'enable-verification': Flags.boolean({
      summary: 'Perform verification',
      default: false,
    }),
    'enable-consent-audit-log': Flags.boolean({
      summary: 'Log consents',
      default: false,
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
    const { flags } = await this.parse(CreateIotaConfig)

    if (flags['no-input']) {
      if (!flags.name) throw new CLIError(giveFlagInputErrorMessage('name'))
      if (!flags['wallet-ari']) throw new CLIError(giveFlagInputErrorMessage('wallet-ari'))
    }

    let walletAri: string = flags['wallet-ari'] || ''

    const { wallets } = await cweService.listWallets()

    const walletAris = wallets.map((wallet: any) => wallet.ari)
    const wrongAriProvided = !walletAris.includes(walletAri)

    if (!walletAri || wallets.length === 0 || wrongAriProvided) {
      const walletChoices = wallets.map((wallet: any) => ({
        name: wallet.name || wallet.id,
        value: wallet.ari,
      }))

      const CREATE_NEW_WALLET = 'Create new wallet'
      walletChoices.push({ name: CREATE_NEW_WALLET, value: CREATE_NEW_WALLET })

      const selectedWallet: string = await select({
        message: 'Select the wallet used to sign the request token to the Affinidi Vault',
        choices: walletChoices,
      })

      if (selectedWallet === CREATE_NEW_WALLET) {
        const walletDidMethodChoices = Object.values(DidMethods).map((method: string) => ({
          name: method,
          value: method,
          default: DidMethods.KEY,
        }))

        const didMethod = await select({ message: 'Select DID method of wallet', choices: walletDidMethodChoices })

        const newWalletData = {
          name: validateInputLength(await input({ message: 'Enter wallet name' }), INPUT_LIMIT),
          description: validateInputLength(
            await input({ message: 'Enter wallet description (optional)' }),
            INPUT_LIMIT,
          ),
          didMethod,
          ...(didMethod === DidMethods.WEB && {
            didWebUrl: validateInputLength(
              await input({ message: 'Enter did:web URL (your applications domain)' }),
              INPUT_LIMIT,
            ),
          }),
        }

        const walletSchema = z.object({
          name: z.string().min(3).max(INPUT_LIMIT).optional(),
          description: z.string().max(INPUT_LIMIT).optional(),
          didMethod: z.nativeEnum(DidMethods).optional(),
          didWebUrl: z.string().max(INPUT_LIMIT).optional(),
        })
        const createWalletInput = walletSchema.parse(newWalletData)

        ux.action.start('Creating wallet')
        const { wallet } = await cweService.createWallet(createWalletInput as any)
        ux.action.stop('Created successfully!')

        walletAri = wallet.ari
      } else {
        walletAri = selectedWallet
      }
    }

    const data: CreateIotaConfigurationInput = {
      name: flags.name ?? validateInputLength(await input({ message: 'Enter Iota configuration name' }), INPUT_LIMIT),
      description: flags.description ?? '',
      walletAri,
      iotaResponseWebhookURL: flags['response-webhook-url'] ?? '',
      enableVerification:
        flags['enable-verification'] ?? (await confirm({ message: 'Enable verification?', default: false })),
      enableConsentAuditLog:
        flags['enable-consent-audit-log'] ?? (await confirm({ message: 'Enable consent audit log?', default: false })),
      tokenMaxAge:
        flags['token-max-age'] ??
        (await number({ message: 'Enter token max age, minutes: 1-10', min: 1, max: 10, default: 10 })),
      clientMetadata: {
        name: flags['client-name'] ?? '',
        origin: flags['client-origin'] ?? '',
        logo: flags['client-logo'] ?? '',
      },
    }

    const schema = z.object({
      name: z.string().min(3).max(INPUT_LIMIT),
      walletAri: z.string().min(1).max(INPUT_LIMIT),
      enableVerification: z.boolean(),
      enableConsentAuditLog: z.boolean(),
      description: z.string().max(INPUT_LIMIT).optional(),
      tokenMaxAge: z.number().min(1).max(10).optional(),
      iotaResponseWebhookURL: z.string().max(INPUT_LIMIT).optional(),
      clientMetadata: z.object({
        name: z.string().max(INPUT_LIMIT),
        origin: z.string().max(INPUT_LIMIT),
        logo: z.string().max(INPUT_LIMIT),
      }),
    })
    const configInput = schema.parse(data)

    ux.action.start('Creating Iota configurations')
    const output = await iotaService.createIotaConfig(configInput)
    ux.action.stop('Created successfully!')

    if (!this.jsonEnabled()) this.logJson(output)
    return output
  }
}
