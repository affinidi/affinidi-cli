import { ux, Flags } from '@oclif/core'
import z from 'zod'
import { BaseCommand } from '../../common'
import { promptRequiredParameters } from '../../helpers'
import { INPUT_LIMIT } from '../../helpers/input-length-validation'
import { clientSDK } from '../../services/affinidi'
import { vpAdapterService } from '../../services/affinidi/vp-adapter'

export class RemoveUserFromGroup extends BaseCommand<typeof RemoveUserFromGroup> {
  static summary = 'Removes a user from a user group'
  static examples = ['<%= config.bin %> <%= command.id %> --group-name my_group --user-mapping-id <value>']
  static flags = {
    'group-name': Flags.string({
      summary: 'Name of the user group',
    }),
    'user-mapping-id': Flags.string({
      summary: 'ID of the user mapping record',
    }),
  }

  public async run(): Promise<{ groupName: string; userMappingId: string }> {
    const { flags } = await this.parse(RemoveUserFromGroup)
    const promptFlags = await promptRequiredParameters(['group-name', 'user-mapping-id'], flags)
    const schema = z.object({
      'group-name': z.string().max(INPUT_LIMIT),
      'user-mapping-id': z.string().max(INPUT_LIMIT),
    })
    const validatedFlags = schema.parse(promptFlags)

    ux.action.start('Removing user from group')
    await vpAdapterService.removeUserFromGroup(
      clientSDK.config.getProjectToken()?.projectAccessToken,
      validatedFlags['group-name'],
      validatedFlags['user-mapping-id'],
    )
    ux.action.stop('Removed successfully!')

    const response = { groupName: validatedFlags['group-name'], userMappingId: validatedFlags['user-mapping-id'] }
    if (!this.jsonEnabled()) this.logJson(response)
    return response
  }
}
