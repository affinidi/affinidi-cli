import { ListPexQueriesOK } from '@affinidi-tdk/iota-client'
import { ux, Flags } from '@oclif/core'
import z from 'zod'
import { BaseCommand } from '../../common/base-command.js'
import { promptRequiredParameters } from '../../common/prompts.js'
import { INPUT_LIMIT } from '../../common/constants.js'

import { iotaService } from '../../services/affinidi/iota/service.js'

export class ListQueries extends BaseCommand<typeof ListQueries> {
  static summary = 'Lists PEX queries for your Affinidi Iota Framework configuration'
  static examples = [
    '<%= config.bin %> <%= command.id %> -c <value>',
    '<%= config.bin %> <%= command.id %> --configuration-id <value>',
  ]
  static flags = {
    'configuration-id': Flags.string({
      char: 'c',
      summary: 'ID of the Affinidi Iota Framework configuration',
    }),
  }

  public async run(): Promise<ListPexQueriesOK> {
    const { flags } = await this.parse(ListQueries)
    const promptFlags = await promptRequiredParameters(['configuration-id'], flags)

    const schema = z.object({
      'configuration-id': z.string().min(1).max(INPUT_LIMIT).uuid(),
    })
    const validatedFlags = schema.parse(promptFlags)

    ux.action.start('Fetching PEX queries')
    const output = await iotaService.listPexQueries(validatedFlags['configuration-id'])
    ux.action.stop('Fetched successfully!')

    if (!this.jsonEnabled()) this.logJson(output)
    return output
  }
}
