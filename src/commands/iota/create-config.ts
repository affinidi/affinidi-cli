import { CreateIotaConfigurationInput, IotaConfigurationDto } from '@affinidi-tdk/iota-client'
import { WalletDto, CreateWalletInput } from '@affinidi-tdk/wallets-client'
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
  static summary = 'Creates Affinidi Iota Framework configuration in your active project'
  static examples = [
    '<%= config.bin %> <%= command.id %> -n <value> -w <value>',
    '<%= config.bin %> <%= command.id %> --name <value> --wallet-ari <value>',
    '<%= config.bin %> <%= command.id %> --name <value> --wallet-ari <value> --enable-consent-audit-log --enable-verification --token-max-age <value>',
  ]
  static flags = {
    name: Flags.string({
      char: 'n',
      summary: 'Name of the Affinidi Iota Framework configuration',
    }),
    description: Flags.string({
      char: 'd',
      summary: 'Description of the Affinidi Iota Framework configuration',
    }),
    'wallet-ari': Flags.string({
      char: 'w',
      summary: 'ARI of the wallet',
    }),
    'token-max-age': Flags.integer({
      summary: 'Token expiration time in seconds',
    }),
    'response-webhook-url': Flags.string({
      summary: 'Affinidi Iota Framework response webhook URL',
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

    let walletAri = flags['wallet-ari']

    ux.action.start('Fetching wallets')
    const { wallets } = await cweService.listWallets()
    ux.action.stop('Fetched successfully!')

    const walletAris = wallets?.map((wallet: WalletDto) => wallet.ari) || []
    const wrongAriProvided = !walletAris.includes(walletAri)

    if (!walletAri || wallets?.length === 0 || wrongAriProvided) {
      const walletChoices =
        wallets?.map((wallet: WalletDto) => ({
          name: wallet.name || wallet.id,
          value: wallet.ari,
        })) || []

      const CREATE_NEW_WALLET = 'Create new wallet'
      walletChoices.push({ name: CREATE_NEW_WALLET, value: CREATE_NEW_WALLET })

      const selectedWallet = await select({
        message: 'Select the wallet used to sign the request token to the Affinidi Vault',
        choices: walletChoices,
      })

      if (selectedWallet === CREATE_NEW_WALLET) {
        const walletDidMethodChoices = Object.values(DidMethods).map((method: string) => ({
          name: method,
          value: method,
          default: DidMethods.KEY,
        }))

        const name = validateInputLength(await input({ message: 'Enter wallet name' }), INPUT_LIMIT)
        const description = validateInputLength(
          await input({ message: 'Enter wallet description (optional)' }),
          INPUT_LIMIT,
        )
        const didMethod = await select({ message: 'Select DID method of wallet', choices: walletDidMethodChoices })

        const isDidWeb = didMethod === DidMethods.WEB
        const didWebUrl = isDidWeb
          ? validateInputLength(await input({ message: 'Enter did:web URL (your applications domain)' }), INPUT_LIMIT)
          : undefined

        const newWalletData = {
          name,
          description,
          didMethod,
          ...(isDidWeb && { didWebUrl }),
        }

        const walletSchema = z
          .object({
            name: z.string().min(3).max(INPUT_LIMIT).optional(),
            description: z.string().max(INPUT_LIMIT).optional(),
            didMethod: z.nativeEnum(DidMethods).optional(),
            didWebUrl: z.string().min(3).max(INPUT_LIMIT).optional(),
          })
          .refine((wallet) => {
            if (wallet.didMethod === DidMethods.WEB && !wallet.didWebUrl) {
              return false
            }
            return true
          })

        const createWalletInput = walletSchema.parse(newWalletData)

        ux.action.start('Creating wallet')
        const output = await cweService.createWallet(createWalletInput as CreateWalletInput)
        ux.action.stop('Created successfully!')

        walletAri = output.wallet?.ari || ''
      } else {
        walletAri = selectedWallet || ''
      }
    }

    const data: CreateIotaConfigurationInput = {
      name:
        flags.name ??
        validateInputLength(await input({ message: 'Enter Affinidi Iota Framework configuration name' }), INPUT_LIMIT),
      description: flags.description ?? '',
      walletAri,
      iotaResponseWebhookURL: flags['response-webhook-url'] ?? '',
      enableVerification: flags['enable-verification'] || false,
      enableConsentAuditLog: flags['enable-consent-audit-log'] || false,
      tokenMaxAge: flags['token-max-age'] ?? undefined,
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

    ux.action.start('Creating Affinidi Iota Framework configuration')
    const output = await iotaService.createIotaConfig(configInput)
    ux.action.stop('Created successfully!')

    if (!this.jsonEnabled()) this.logJson(output)
    return output
  }
}
