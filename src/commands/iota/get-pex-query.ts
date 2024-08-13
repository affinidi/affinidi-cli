import { PexQueryDto } from '@affinidi-tdk/iota-client'
import { ux, Flags } from '@oclif/core'
import z from 'zod'
import { BaseCommand } from '../../common/base-command.js'
import { promptRequiredParameters } from '../../common/prompts.js'
import { INPUT_LIMIT } from '../../common/validators.js'
import { iotaService } from '../../services/affinidi/iota/service.js'

export class GetPexQuery extends BaseCommand<typeof GetPexQuery> {
  static summary = 'Gets the PEX query details for your Iota configuration'
  static examples = ['<%= config.bin %> <%= command.id %> --configuration-id <uuid> --query-id <uuid>']
  static flags = {
    'configuration-id': Flags.string({
      summary: 'ID of the Iota configuration',
    }),
    'query-id': Flags.string({
      summary: 'PEX query ID',
    }),
  }

  public async run(): Promise<PexQueryDto> {
    const { flags } = await this.parse(GetPexQuery)
    const promptFlags = await promptRequiredParameters(['configuration-id', 'query-id'], flags)
    const schema = z.object({
      configurationId: z.string().max(INPUT_LIMIT).uuid(),
      queryId: z.string().max(INPUT_LIMIT).uuid(),
    })
    const validatedFlags = schema.parse(promptFlags)

    ux.action.start('Fetching PEX query')
    const output = await iotaService.getPexQueryById(validatedFlags.configurationId, validatedFlags.queryId)
    ux.action.stop('Fetched successfully!')

    if (!this.jsonEnabled()) this.logJson(output)
    return output
  }
}
