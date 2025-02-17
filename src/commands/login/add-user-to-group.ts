import { GroupUserMappingDto } from '@affinidi-tdk/login-configuration-client'
import { ux, Flags } from '@oclif/core'
import z from 'zod'
import { BaseCommand } from '../../common/base-command.js'
import { promptRequiredParameters } from '../../common/prompts.js'
import { INPUT_LIMIT } from '../../common/validators.js'
import { vpAdapterService } from '../../services/affinidi/vp-adapter/service.js'

export class AddUserToGroup extends BaseCommand<typeof AddUserToGroup> {
  static summary = 'Adds a user to a user group'
  static examples = ['<%= config.bin %> <%= command.id %> --group-name my_group --user-id did:key:12345']
  static flags = {
    'group-name': Flags.string({
      summary: 'Name of the user group',
    }),
    'user-id': Flags.string({
      summary: "Id of the user. Currently the user's DID is supported",
    }),
    'user-name': Flags.string({
      summary: 'Name of the user',
    }),
    'user-description': Flags.string({
      summary: 'Description of the user',
    }),
  }

  public async run(): Promise<GroupUserMappingDto> {
    const { flags } = await this.parse(AddUserToGroup)
    const promptFlags = await promptRequiredParameters(['group-name', 'user-id'], flags)
    const schema = z.object({
      'group-name': z.string().max(INPUT_LIMIT),
      'user-id': z.string().max(INPUT_LIMIT),
      'user-name': z.string().max(INPUT_LIMIT).optional(),
      'user-description': z.string().max(INPUT_LIMIT).optional(),
    })
    const validatedFlags = schema.parse(promptFlags)

    ux.action.start('Adding user to group')
    const addUserToGroupOutput = await vpAdapterService.addUserToGroup(validatedFlags['group-name'], {
      userId: validatedFlags['user-id'],
      ...(validatedFlags['user-name'] && { name: validatedFlags['user-name'] }),
      ...(validatedFlags['user-description'] && { description: validatedFlags['user-description'] }),
    })
    ux.action.stop('Added successfully!')

    if (!this.jsonEnabled()) this.logJson(addUserToGroupOutput)
    return addUserToGroupOutput
  }
}
