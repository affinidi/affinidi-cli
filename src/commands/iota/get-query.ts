import { PexQueryDto } from '@affinidi-tdk/iota-client'
import { ux, Flags } from '@oclif/core'
import z from 'zod'
import { BaseCommand } from '../../common/base-command.js'
import { promptRequiredParameters } from '../../common/prompts.js'
import { INPUT_LIMIT } from '../../common/validators.js'
import { iotaService } from '../../services/affinidi/iota/service.js'

export class GetQuery extends BaseCommand<typeof GetQuery> {
  static summary = 'Gets the PEX query details for your Affinidi Iota Framework configuration'
  static examples = [
    '<%= config.bin %> <%= command.id %> -c <uuid> -i <uuid>',
    '<%= config.bin %> <%= command.id %> --configuration-id <uuid> --query-id <uuid>',
  ]
  static flags = {
    'configuration-id': Flags.string({
      char: 'c',
      summary: 'ID of the Affinidi Iota Framework configuration',
    }),
    'query-id': Flags.string({
      char: 'i',
      summary: 'PEX query ID',
    }),
  }

  public async run(): Promise<PexQueryDto> {
    const { flags } = await this.parse(GetQuery)
    const promptFlags = await promptRequiredParameters(['configuration-id', 'query-id'], flags)

    const schema = z.object({
      'configuration-id': z.string().min(1).max(INPUT_LIMIT).uuid(),
      'query-id': z.string().min(1).max(INPUT_LIMIT).uuid(),
    })
    const validatedFlags = schema.parse(promptFlags)

    ux.action.start('Fetching PEX query')
    const output = await iotaService.getPexQueryById(validatedFlags['configuration-id'], validatedFlags['query-id'])
    ux.action.stop('Fetched successfully!')

    if (!this.jsonEnabled()) this.logJson(output)
    return output
  }
}
