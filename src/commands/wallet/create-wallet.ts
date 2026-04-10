import { readFileSync } from 'fs'
import { CreateWalletV2Input, CreateWalletV2Response } from '@affinidi-tdk/wallets-client'
import { input, select, confirm } from '@inquirer/prompts'
import { ux, Flags } from '@oclif/core'
import { CLIError } from '@oclif/core/errors'
import z from 'zod'
import { BaseCommand } from '../../common/base-command.js'
import { DidMethods, WalletAlgorithms, ServiceEndpointTypes } from '../../common/constants.js'
import { giveFlagInputErrorMessage } from '../../common/error-messages.js'
import { INPUT_LIMIT, validateInputLength } from '../../common/validators.js'
import { cweService } from '../../services/affinidi/cwe/service.js'

export class CreateWallet extends BaseCommand<typeof CreateWallet> {
  static summary = 'Creates wallet in your active project'
  static examples = [
    '<%= config.bin %> <%= command.id %>',
    '<%= config.bin %> <%= command.id %> --name <value> --description <value>',
    '<%= config.bin %> <%= command.id %> --name <value> --description <value> --did-method key --algorithm ed25519',
    '<%= config.bin %> <%= command.id %> --name <value> --description <value> --did-method web --did-web-url <value>',
    '<%= config.bin %> <%= command.id %> --name <value> --did-method peer2 --algorithm secp256k1 --services <value>',
  ]
  static flags = {
    name: Flags.string({
      char: 'n',
      summary: 'Name of the wallet',
    }),
    description: Flags.string({
      char: 'd',
      summary: 'Description of the wallet',
      default: '',
    }),
    'did-method': Flags.string({
      char: 'm',
      summary: 'DID method',
      options: Object.values(DidMethods),
    }),
    'did-web-url': Flags.string({
      char: 'u',
      summary: 'URL of the DID if DID method is did:web',
      dependsOn: ['did-method'],
      relationships: [
        // Make this flag dependent on all of these flags
        {
          type: 'all',
          flags: [
            // Include `didWebUrl` but only when `method` is equal to `web`
            { name: 'did-web-url', when: async (flags) => flags['did-method'] === DidMethods.WEB },
          ],
        },
      ],
    }),
    algorithm: Flags.string({
      char: 'a',
      summary: 'Algorithm to generate key for the wallet',
      options: Object.values(WalletAlgorithms),
    }),
    services: Flags.string({
      char: 's',
      summary: 'Service endpoints to include in DID document (JSON string or file path)',
    }),
  }

  public async run(): Promise<CreateWalletV2Response> {
    const { flags } = await this.parse(CreateWallet)

    if (flags['no-input']) {
      if (!flags['did-method']) {
        throw new CLIError(giveFlagInputErrorMessage('did-method'))
      }

      if (flags['did-method'] === DidMethods.WEB && !flags['did-web-url']) {
        throw new CLIError(giveFlagInputErrorMessage('did-web-url'))
      }
    }

    const walletDidMethodChoices = Object.values(DidMethods).map((method: string) => ({
      name: method,
      value: method,
      default: DidMethods.KEY,
    }))

    const walletAlgorithmChoices = Object.values(WalletAlgorithms).map((algo: string) => ({
      name: algo,
      value: algo,
      default: WalletAlgorithms.SECP256K1,
    }))

    const name = flags.name ?? ''
    const description = flags.description ?? ''
    const didMethod =
      flags['did-method'] ?? (await select({ message: 'Select DID method of wallet', choices: walletDidMethodChoices }))

    const isDidWeb = didMethod === DidMethods.WEB
    const didWebUrl = isDidWeb
      ? flags['did-web-url'] ??
        validateInputLength(await input({ message: 'Enter did:web URL (your applications domain)' }), INPUT_LIMIT)
      : undefined

    const algorithm =
      flags.algorithm ??
      (await select({
        message: 'Select algorithm to generate key for the wallet',
        choices: walletAlgorithmChoices,
      }))

    let services: Array<{ name: string; description: string; url: string; serviceType?: string }> | undefined
    if (flags.services) {
      services = this.parseServices(flags.services)
    } else if (!flags['no-input']) {
      services = await this.collectServiceEndpoints()
    }

    const data = {
      ...(name && { name }),
      ...(description && { description }),
      ...(didMethod && { didMethod }),
      ...(isDidWeb && didWebUrl && { didWebUrl }),
      ...(algorithm && { algorithm }),
      ...(services && services.length > 0 && { services }),
    }

    const schema = z
      .object({
        name: z.string().max(INPUT_LIMIT).optional(),
        description: z.string().max(INPUT_LIMIT).optional(),
        didMethod: z.nativeEnum(DidMethods).optional(),
        didWebUrl: z.string().min(3).max(INPUT_LIMIT).optional(),
        algorithm: z.nativeEnum(WalletAlgorithms).optional(),
        services: z
          .array(
            z.object({
              name: z.string(),
              description: z.string(),
              url: z.string().min(1),
              serviceType: z.nativeEnum(ServiceEndpointTypes).optional(),
            }),
          )
          .optional(),
      })
      .refine((wallet) => {
        if (wallet.didMethod === DidMethods.WEB && !wallet.didWebUrl) {
          return false
        }
        return true
      })

    const createWalletInput = schema.parse(data) as CreateWalletV2Input

    this.log('\n=== DEBUG: CreateWalletV2Input ===')
    this.log(JSON.stringify(createWalletInput, null, 2))
    this.log('=================================\n')

    ux.action.start('Creating wallet')
    const output = await cweService.createWallet(createWalletInput)
    ux.action.stop('Created successfully!')

    if (!this.jsonEnabled()) this.logJson(output)
    return output
  }

  private async collectServiceEndpoints(): Promise<
    Array<{ name: string; description: string; url: string; serviceType?: string }> | undefined
  > {
    const addServices = await confirm({
      message: 'Do you want to add service endpoints to the DID document?',
      default: false,
    })

    if (!addServices) {
      return undefined
    }

    const services: Array<{ name: string; description: string; url: string; serviceType?: string }> = []
    let addMore = true

    while (addMore) {
      this.log('\n--- Add Service Endpoint ---')

      const serviceName = validateInputLength(
        await input({
          message: 'Service name:',
        }),
        INPUT_LIMIT,
      )

      const serviceDescription = validateInputLength(
        await input({
          message: 'Service description:',
        }),
        INPUT_LIMIT,
      )

      const serviceUrl = await input({
        message: 'Service URL:',
        validate: (value) => {
          if (!value || value.trim().length === 0) {
            return 'Service URL is required. Please enter a valid HTTP or HTTPS URL.'
          }
          if (!value.match(/^https?:\/\/.+/)) {
            return 'Service URL must start with http:// or https://'
          }
          return true
        },
      })

      const serviceTypeChoices = Object.values(ServiceEndpointTypes).map((type: string) => ({
        name: type,
        value: type,
      }))

      const serviceType = await select({
        message: 'Select service type:',
        choices: serviceTypeChoices,
        default: ServiceEndpointTypes.DID_COMM_MESSAGING,
      })

      const service: { name: string; description: string; url: string; serviceType?: string } = {
        name: serviceName,
        description: serviceDescription,
        url: serviceUrl,
        serviceType: serviceType,
      }

      services.push(service)

      addMore = await confirm({
        message: 'Do you want to add another service endpoint?',
        default: false,
      })
    }

    return services.length > 0 ? services : undefined
  }

  private parseServices(
    servicesInput: string,
  ): Array<{ name: string; description: string; url: string; serviceType?: string }> {
    try {
      // Try to parse as JSON string first
      const parsed = JSON.parse(servicesInput)
      if (!Array.isArray(parsed)) {
        throw new CLIError('Services must be an array of service endpoint objects')
      }
      return parsed
    } catch (jsonError) {
      // If not valid JSON, assume it's a file path
      try {
        const fileContent = readFileSync(servicesInput, 'utf-8')
        const parsed = JSON.parse(fileContent)
        if (!Array.isArray(parsed)) {
          throw new CLIError('Services must be an array of service endpoint objects')
        }
        return parsed
      } catch (error) {
        throw new CLIError(
          'Services must be a valid JSON array string or a path to a JSON file.\n' +
            'Example: \'[{"name":"vc-store","description":"Credential Store","url":"https://example.com/vc","serviceType":"VerifiableCredentialService"}]\'',
        )
      }
    }
  }
}
