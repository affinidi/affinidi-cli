import { PexQueryDto } from '@affinidi-tdk/iota-client'
import { ux, Flags } from '@oclif/core'
import z from 'zod'
import { BaseCommand } from '../../common/base-command.js'
import { promptRequiredParameters } from '../../common/prompts.js'
import { INPUT_LIMIT } from '../../common/validators.js'
import { iotaService } from '../../services/affinidi/iota/service.js'

export class ListPexQueries extends BaseCommand<typeof ListPexQueries> {
  static summary = 'Lists PEX queries for your Iota configuration'
  static examples = [
    '<%= config.bin %> <%= command.id %> -i <value>',
    '<%= config.bin %> <%= command.id %> --configuration-id <value>',
  ]
  static flags = {
    'configuration-id': Flags.string({
      char: 'i',
      summary: 'ID of the Iota configuration',
    }),
  }

  public async run(): Promise<PexQueryDto[]> {
    const { flags } = await this.parse(ListPexQueries)
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
