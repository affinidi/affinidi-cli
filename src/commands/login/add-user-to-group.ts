import { ux, Flags } from '@oclif/core'
import z from 'zod'
import { BaseCommand } from '../../common'
import { promptRequiredParameters } from '../../helpers'
import { INPUT_LIMIT } from '../../helpers/input-length-validation'
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
    const schema = z.object({
      'group-name': z.string().max(INPUT_LIMIT),
      'user-sub': z.string().max(INPUT_LIMIT),
    })
    const validatedFlags = schema.parse(promptFlags)

    ux.action.start('Adding user to group')
    const addUserToGroupOutput = await vpAdapterService.addUserToGroup(
      clientSDK.config.getProjectToken()?.projectAccessToken,
      validatedFlags['group-name'],
      validatedFlags['user-sub'],
    )
    ux.action.stop('Added successfully!')

    if (!this.jsonEnabled()) this.logJson(addUserToGroupOutput)
    return addUserToGroupOutput
  }
}
