import { CreateWalletInput, WalletDto } from '@affinidi-tdk/wallets-client'
import { input } from '@inquirer/prompts'
import { ux, Flags } from '@oclif/core'
import { CLIError } from '@oclif/core/errors'
import z from 'zod'
import { BaseCommand } from '../../common/base-command.js'
import { DidMethods } from '../../common/constants.js'
import { giveFlagInputErrorMessage } from '../../common/error-messages.js'
import { promptRequiredParameters } from '../../common/prompts.js'
import { INPUT_LIMIT, validateInputLength } from '../../common/validators.js'
import { cweService } from '../../services/affinidi/cwe/service.js'

export class CreateWallet extends BaseCommand<typeof CreateWallet> {
  static summary = 'Creates wallet in your active project'
  static examples = [
    '<%= config.bin %> <%= command.id %>',
    '<%= config.bin %> <%= command.id %> --name <value> --description <value>',
    '<%= config.bin %> <%= command.id %> --name <value> --description <value> --did-method key',
    '<%= config.bin %> <%= command.id %> --name <value> --description <value> --did-method web --did-web-url <value>',
  ]
  static flags = {
    name: Flags.string({
      char: 'n',
      summary: 'Name of the wallet',
    }),
    description: Flags.string({
      char: 'd',
      summary: 'Description of the wallet',
    }),
    'did-method': Flags.string({
      char: 'm',
      summary: 'DID method',
      options: Object.values(DidMethods),
      default: DidMethods.KEY,
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
            { name: 'did-web-url', when: async (flags: any) => flags['did-method'] === DidMethods.WEB },
          ],
        },
      ],
    }),
  }

  public async run(): Promise<WalletDto> {
    const { flags } = await this.parse(CreateWallet)

    if (flags['no-input'] && flags['did-method'] === DidMethods.WEB) {
      const promptFlags = await promptRequiredParameters(['did-web-url'], flags)

      if (!promptFlags['did-web-url']) {
        throw new CLIError(giveFlagInputErrorMessage('did-web-url'))
      }
    }

    const data: any = {}

    if (flags['did-method'] === DidMethods.WEB) {
      data.name = flags.name
      data.description = flags.description
      data.didMethod = flags['did-method']
      data.didWebUrl =
        flags['did-web-url'] ?? validateInputLength(await input({ message: 'Enter did:web URL' }), INPUT_LIMIT)
    }

    const schema = z.object({
      name: z.string().min(1).max(INPUT_LIMIT).optional(),
      description: z.string().min(1).max(INPUT_LIMIT).optional(),
      didMethod: z.nativeEnum(DidMethods).optional(),
      didWebUrl: z.string().min(1).max(INPUT_LIMIT).optional(),
    })
    const createWalletInput = schema.parse(data)

    ux.action.start('Creating wallet')
    const output = await cweService.createWallet(createWalletInput as any)
    ux.action.stop('Created successfully!')

    if (!this.jsonEnabled()) this.logJson(output)
    return output
  }
}
