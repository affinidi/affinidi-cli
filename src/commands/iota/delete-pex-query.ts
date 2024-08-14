import { ux, Flags } from '@oclif/core'
import { CLIError } from '@oclif/core/errors'
import z from 'zod'
import { BaseCommand } from '../../common/base-command.js'
import { giveFlagInputErrorMessage } from '../../common/error-messages.js'
import { promptRequiredParameters } from '../../common/prompts.js'
import { INPUT_LIMIT } from '../../common/validators.js'
import { iotaService } from '../../services/affinidi/iota/service.js'

export class DeletePexQuery extends BaseCommand<typeof DeletePexQuery> {
  static summary = 'Deletes the PEX query from your Iota configuration'
  static examples = ['<%= config.bin %> <%= command.id %> --configuration-id <uuid> --query-id <uuid>']
  static flags = {
    'configuration-id': Flags.string({
      summary: 'ID of the Iota configuration',
    }),
    'query-id': Flags.string({
      summary: 'PEX query ID',
    }),
  }

  public async run(): Promise<{ queryId: string }> {
    const { flags } = await this.parse(DeletePexQuery)
    const promptFlags = await promptRequiredParameters(['configuration-id', 'query-id'], flags)

    if (flags['no-input']) {
      if (!flags['query-id']) throw new CLIError(giveFlagInputErrorMessage('query-id'))
      if (!flags['configuration-id']) throw new CLIError(giveFlagInputErrorMessage('configuration-id'))
    }

    const schema = z.object({
      'configuration-id': z.string().max(INPUT_LIMIT).uuid(),
      'query-id': z.string().max(INPUT_LIMIT).uuid(),
    })
    const validatedFlags = schema.parse(promptFlags)

    ux.action.start('Deleting PEX queries')
    await iotaService.deletePexQueryById(validatedFlags['configuration-id'], validatedFlags['query-id'])
    ux.action.stop('Deleted successfully!')

    if (!this.jsonEnabled()) this.logJson({ queryId: validatedFlags['query-id'] })
    return { queryId: validatedFlags['query-id'] }
  }
}
