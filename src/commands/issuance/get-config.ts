import { IssuanceConfigDto } from '@affinidi-tdk/credential-issuance-client'
import { ux, Flags } from '@oclif/core'
import z from 'zod'
import { BaseCommand } from '../../common/base-command.js'
import { promptRequiredParameters } from '../../common/prompts.js'
import { INPUT_LIMIT } from '../../common/validators.js'
import { issuanceService } from '../../services/affinidi/cis/service.js'

export class GetIssuanceConfig extends BaseCommand<typeof GetIssuanceConfig> {
  static summary = 'Gets the details of the credential issuance configuration in your active project'
  static examples = [
    '<%= config.bin %> <%= command.id %> -i <value>',
    '<%= config.bin %> <%= command.id %> --id <value>',
  ]
  static flags = {
    id: Flags.string({
      char: 'i',
      summary: 'ID of the credential issuance configuration',
    }),
  }

  public async run(): Promise<IssuanceConfigDto> {
    const { flags } = await this.parse(GetIssuanceConfig)
    const promptFlags = await promptRequiredParameters(['id'], flags)

    const schema = z.object({
      id: z.string().max(INPUT_LIMIT),
    })
    const validatedFlags = schema.parse(promptFlags)

    ux.action.start('Fetching credential issuance configuration')
    const output = await issuanceService.getIssuanceConfigById(validatedFlags.id)
    ux.action.stop('Fetched successfully!')

    if (!this.jsonEnabled()) this.logJson(output)
    return output
  }
}
