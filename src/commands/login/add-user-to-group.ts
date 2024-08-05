import { ux, Flags } from '@oclif/core'
import z from 'zod'
import { BaseCommand } from '../../common/base-command.js'
import { promptRequiredParameters } from '../../common/prompts.js'
import { INPUT_LIMIT } from '../../common/validators.js'
import { vpAdapterService } from '../../services/affinidi/vp-adapter/service.js'
import { GroupUserMappingDto } from '../../services/affinidi/vp-adapter/vp-adapter.api.js'

export class AddUserToGroup extends BaseCommand<typeof AddUserToGroup> {
  static summary = 'Adds a user to a user group'
  static examples = ['<%= config.bin %> <%= command.id %> --group-name my_group --user-id did:key:12345']
  static flags = {
    'group-name': Flags.string({
      summary: 'Name of the user group',
    }),
    'user-id': Flags.string({
      summary: "Id of the user. Currently the user's DID is supported.",
    }),
  }

  public async run(): Promise<GroupUserMappingDto> {
    const { flags } = await this.parse(AddUserToGroup)
    const promptFlags = await promptRequiredParameters(['group-name', 'user-id'], flags)
    const schema = z.object({
      'group-name': z.string().max(INPUT_LIMIT),
      'user-id': z.string().max(INPUT_LIMIT),
    })
    const validatedFlags = schema.parse(promptFlags)

    ux.action.start('Adding user to group')
    const addUserToGroupOutput = await vpAdapterService.addUserToGroup(
      validatedFlags['group-name'],
      validatedFlags['user-id'],
    )
    ux.action.stop('Added successfully!')

    if (!this.jsonEnabled()) this.logJson(addUserToGroupOutput)
    return addUserToGroupOutput
  }
}
