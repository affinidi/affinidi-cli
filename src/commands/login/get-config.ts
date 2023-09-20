import { ux, Flags } from '@oclif/core'
import { BaseCommand } from '../../common'
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
      required: true,
    }),
  }

  public async run(): Promise<LoginConfigurationObject> {
    const { flags } = await this.parse(GetLoginConfiguration)

    ux.action.start('Fetching login configuration')
    const getLoginConfigOutput = await vpAdapterService.getLoginConfigurationById(
      clientSDK.config.getProjectToken()?.projectAccessToken,
      flags.id,
    )
    ux.action.stop('Fetched successfully!')

    if (!this.jsonEnabled()) this.logJson(getLoginConfigOutput)
    return getLoginConfigOutput
  }
}
