import { ux, Flags } from '@oclif/core'
import z from 'zod'
import { BaseCommand } from '../../common'
import { promptRequiredParameters } from '../../common/prompts'
import { INPUT_LIMIT } from '../../common/validators'
import { clientSDK } from '../../services/affinidi'
import { vpAdapterService } from '../../services/affinidi/vp-adapter'
import { LoginConfigurationObject } from '../../services/affinidi/vp-adapter/vp-adapter.api'

export class GetLoginConfiguration extends BaseCommand<typeof GetLoginConfiguration> {
  static summary = 'Gets the details of a login configuration in your active project'
  static examples = [
    '<%= config.bin %> <%= command.id %> -i <value>',
    '<%= config.bin %> <%= command.id %> --id <value>',
  ]
  static flags = {
    id: Flags.string({
      char: 'i',
      summary: 'ID of the login configuration',
    }),
  }

  public async run(): Promise<LoginConfigurationObject> {
    const { flags } = await this.parse(GetLoginConfiguration)
    const promptFlags = await promptRequiredParameters(['id'], flags)
    const schema = z.object({
      id: z.string().max(INPUT_LIMIT),
    })
    const validatedFlags = schema.parse(promptFlags)

    ux.action.start('Fetching login configuration')
    const getLoginConfigOutput = await vpAdapterService.getLoginConfigurationById(
      clientSDK.config.getProjectToken()?.projectAccessToken,
      validatedFlags.id,
    )
    ux.action.stop('Fetched successfully!')

    if (!this.jsonEnabled()) this.logJson(getLoginConfigOutput)
    return getLoginConfigOutput
  }
}
