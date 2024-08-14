import { UpdateWalletInput, WalletDto } from '@affinidi-tdk/wallets-client'
import { ux, Flags } from '@oclif/core'
import { CLIError } from '@oclif/core/errors'
import z from 'zod'
import { BaseCommand } from '../../common/base-command.js'
import { giveFlagInputErrorMessage } from '../../common/error-messages.js'
import { promptRequiredParameters } from '../../common/prompts.js'
import { INPUT_LIMIT } from '../../common/validators.js'
import { cweService } from '../../services/affinidi/cwe/service.js'

export class UpdateWallet extends BaseCommand<typeof UpdateWallet> {
  static summary = 'Updates wallet in your active project'
  static examples = [
    '<%= config.bin %> <%= command.id %> -i <value>',
    '<%= config.bin %> <%= command.id %> --id <value> --name <value> --description <value>',
  ]
  static flags = {
    id: Flags.string({
      char: 'i',
      summary: 'ID of the wallet',
    }),
    name: Flags.string({
      char: 'n',
      summary: 'Name of the wallet',
    }),
    description: Flags.string({
      char: 'd',
      summary: 'Description of the wallet',
    }),
  }

  public async run(): Promise<WalletDto> {
    const { flags } = await this.parse(UpdateWallet)
    const promptFlags = await promptRequiredParameters(['id'], flags)

    if (flags['no-input']) {
      if (!flags.id) throw new CLIError(giveFlagInputErrorMessage('id'))
    }

    let data: UpdateWalletInput = {}

    data = {
      name: promptFlags.name,
      description: promptFlags.description,
    }

    const schema = z.object({
      id: z.string().max(INPUT_LIMIT),
      name: z.string().min(1).max(INPUT_LIMIT).optional(),
      description: z.string().min(1).max(INPUT_LIMIT).optional(),
    })
    const validatedFlags = schema.parse(promptFlags)

    ux.action.start('Updating wallet')
    const output = await cweService.updateWallet(validatedFlags.id, data)
    ux.action.stop('Updated successfully!')

    if (!this.jsonEnabled()) this.logJson(output)
    return output
  }
}
