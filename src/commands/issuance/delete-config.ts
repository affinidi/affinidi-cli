import { ux, Flags } from '@oclif/core'
import z from 'zod'
import { BaseCommand } from '../../common/base-command.js'
import { promptRequiredParameters } from '../../common/prompts.js'
import { INPUT_LIMIT } from '../../common/validators.js'
import { issuanceService } from '../../services/affinidi/cis/service.js'

export class DeleteIssuanceConfig extends BaseCommand<typeof DeleteIssuanceConfig> {
  static summary = 'Deletes credential issuance configuration from your active project'
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

  public async run(): Promise<{ id: string }> {
    const { flags } = await this.parse(DeleteIssuanceConfig)
    const promptFlags = await promptRequiredParameters(['id'], flags)

    const schema = z.object({
      id: z.string().max(INPUT_LIMIT),
    })
    const validatedFlags = schema.parse(promptFlags)

    ux.action.start('Deleting credential issuance configuration')
    await issuanceService.deleteIssuanceConfigById(validatedFlags.id)
    ux.action.stop('Deleted successfully!')

    if (!this.jsonEnabled()) this.logJson({ id: validatedFlags.id })
    return { id: validatedFlags.id }
  }
}
