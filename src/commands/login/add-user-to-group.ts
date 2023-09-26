import { ux, Flags } from '@oclif/core'
import { BaseCommand } from '../../common'
import { promptRequiredParameters } from '../../helpers'
import { clientSDK } from '../../services/affinidi'
import { vpAdapterService } from '../../services/affinidi/vp-adapter'
import { GroupUserMappingDto } from '../../services/affinidi/vp-adapter/vp-adapter.api'

export class AddUserToGroup extends BaseCommand<typeof AddUserToGroup> {
  static summary = 'Adds a user to a user group'
  static examples = ['<%= config.bin %> <%= command.id %> --group-name my_group --user-sub did:key:12345']
  static flags = {
    'group-name': Flags.string({
      summary: 'Name of the user group',
    }),
    'user-sub': Flags.string({
      summary: "Subject of the user. Currently the user's DID is supported.",
    }),
  }

  public async run(): Promise<GroupUserMappingDto> {
    const { flags } = await this.parse(AddUserToGroup)
    const promptFlags = await promptRequiredParameters(['group-name', 'user-sub'], flags)

    ux.action.start('Adding user to group')
    const addUserToGroupOutput = await vpAdapterService.addUserToGroup(
      clientSDK.config.getProjectToken()?.projectAccessToken,
      promptFlags['group-name'],
      promptFlags['user-sub'],
    )
    ux.action.stop('Added successfully!')

    if (!this.jsonEnabled()) this.logJson(addUserToGroupOutput)
    return addUserToGroupOutput
  }
}
