import { ux, Flags } from '@oclif/core'
import { BaseCommand } from '../../common'
import { promptRequiredParameters } from '../../helpers'
import { clientSDK } from '../../services/affinidi'
import { vpAdapterService } from '../../services/affinidi/vp-adapter'
import { GroupDto } from '../../services/affinidi/vp-adapter/vp-adapter.api'

export class GetGroup extends BaseCommand<typeof GetGroup> {
  static summary = 'Gets the details of a user group'
  static examples = [
    '<%= config.bin %> <%= command.id %> -n my_group',
    '<%= config.bin %> <%= command.id %> --name my_group',
  ]

  static flags = {
    name: Flags.string({
      char: 'n',
      description: 'Name of the user group',
    }),
  }

  public async run(): Promise<GroupDto> {
    const { flags } = await this.parse(GetGroup)
    const promptFlags = await promptRequiredParameters(['name'], flags)

    ux.action.start('Fetching user group')
    const getGroupOutput = await vpAdapterService.getGroup(
      clientSDK.config.getProjectToken()?.projectAccessToken,
      promptFlags.name,
    )
    ux.action.stop('Fetched successfully!')

    if (!this.jsonEnabled()) this.logJson(getGroupOutput)
    return getGroupOutput
  }
}
