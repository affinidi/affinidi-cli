import { ux, Flags } from '@oclif/core'
import z from 'zod'
import { BaseCommand } from '../../common/base-command.js'
import { promptRequiredParameters } from '../../common/prompts.js'
import { INPUT_LIMIT } from '../../common/validators.js'
import { iotaService } from '../../services/affinidi/iota/service.js'

export class DeleteQuery extends BaseCommand<typeof DeleteQuery> {
  static summary = 'Deletes the PEX query from your Affinidi Iota Framework configuration'
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

  public async run(): Promise<{ queryId: string }> {
    const { flags } = await this.parse(DeleteQuery)
    const promptFlags = await promptRequiredParameters(['configuration-id', 'query-id'], flags)

    const schema = z.object({
      'configuration-id': z.string().max(INPUT_LIMIT).uuid(),
      'query-id': z.string().max(INPUT_LIMIT).uuid(),
    })
    const validatedFlags = schema.parse(promptFlags)

    ux.action.start('Deleting PEX query')
    await iotaService.deletePexQueryById(validatedFlags['configuration-id'], validatedFlags['query-id'])
    ux.action.stop('Deleted successfully!')

    if (!this.jsonEnabled()) this.logJson({ queryId: validatedFlags['query-id'] })
    return { queryId: validatedFlags['query-id'] }
  }
}
