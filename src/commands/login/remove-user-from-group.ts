import { ux, Flags } from '@oclif/core'
import z from 'zod'
import { BaseCommand } from '../../common/base-command.js'
import { promptRequiredParameters } from '../../common/prompts.js'
import { INPUT_LIMIT } from '../../common/constants.js'

import { vpAdapterService } from '../../services/affinidi/vp-adapter/service.js'

export class RemoveUserFromGroup extends BaseCommand<typeof RemoveUserFromGroup> {
  static summary = 'Removes a user from a user group'
  static examples = ['<%= config.bin %> <%= command.id %> --group-name my_group --user-id did:key:12345']
  static flags = {
    'group-name': Flags.string({
      summary: 'Name of the user group',
    }),
    'user-id': Flags.string({
      summary: 'ID of the user',
    }),
  }

  public async run(): Promise<{ groupName: string; userId: string }> {
    const { flags } = await this.parse(RemoveUserFromGroup)
    const promptFlags = await promptRequiredParameters(['group-name', 'user-id'], flags)
    const schema = z.object({
      'group-name': z.string().max(INPUT_LIMIT),
      'user-id': z.string().max(INPUT_LIMIT),
    })
    const validatedFlags = schema.parse(promptFlags)

    ux.action.start('Removing user from group')
    await vpAdapterService.removeUserFromGroup(validatedFlags['group-name'], validatedFlags['user-id'])
    ux.action.stop('Removed successfully!')

    const response = { groupName: validatedFlags['group-name'], userId: validatedFlags['user-id'] }
    if (!this.jsonEnabled()) this.logJson(response)
    return response
  }
}
