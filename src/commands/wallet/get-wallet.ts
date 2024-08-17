import { WalletDto } from '@affinidi-tdk/wallets-client'
import { ux, Flags } from '@oclif/core'
import z from 'zod'
import { BaseCommand } from '../../common/base-command.js'
import { promptRequiredParameters } from '../../common/prompts.js'
import { INPUT_LIMIT } from '../../common/validators.js'
import { cweService } from '../../services/affinidi/cwe/service.js'

export class GetWallet extends BaseCommand<typeof GetWallet> {
  static summary = 'Gets wallet details in your active project'
  static examples = [
    '<%= config.bin %> <%= command.id %> -i <value>',
    '<%= config.bin %> <%= command.id %> --id <value>',
  ]
  static flags = {
    id: Flags.string({
      char: 'i',
      summary: 'ID of the wallet',
    }),
  }

  public async run(): Promise<WalletDto> {
    const { flags } = await this.parse(GetWallet)
    const promptFlags = await promptRequiredParameters(['id'], flags)

    const schema = z.object({
      id: z.string().max(INPUT_LIMIT),
    })
    const validatedFlags = schema.parse(promptFlags)

    ux.action.start('Fetching wallet details')
    const output = await cweService.getWallet(validatedFlags.id)
    ux.action.stop('Fetched successfully!')

    if (!this.jsonEnabled()) this.logJson(output)
    return output
  }
}
