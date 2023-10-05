import { Flags, ux } from '@oclif/core'
import chalk from 'chalk'
import z from 'zod'
import { BaseCommand } from '../../common'
import { promptRequiredParameters } from '../../helpers'
import { CREATE_GROUP_NAME_LIMIT, INPUT_LIMIT } from '../../helpers/input-length-validation'
import { clientSDK } from '../../services/affinidi'
import { vpAdapterService } from '../../services/affinidi/vp-adapter'
import { GroupDto } from '../../services/affinidi/vp-adapter/vp-adapter.api'

export class CreateGroup extends BaseCommand<typeof CreateGroup> {
  static summary = 'Create a user group in your active project'
  static examples = [
    '<%= config.bin %> <%= command.id %> -n my_new_group',
    '<%= config.bin %> <%= command.id %> --name my_new_group',
  ]
  static flags = {
    name: Flags.string({
      char: 'n',
      summary: `Name of the user group, that follows url-friendly pattern ${chalk.inverse('^[a-z_]+$')}`,
    }),
  }

  public async run(): Promise<GroupDto> {
    const { flags } = await this.parse(CreateGroup)
    const promptFlags = await promptRequiredParameters(['name'], flags)
    const schema = z.object({
      name: z.string().max(CREATE_GROUP_NAME_LIMIT),
    })
    const validatedFlags = schema.parse(promptFlags)

    ux.action.start('Creating user group')
    const createGroupOutput = await vpAdapterService.createGroup(
      clientSDK.config.getProjectToken()?.projectAccessToken,
      validatedFlags.name,
    )
    ux.action.stop('Created successfully!')

    if (!this.jsonEnabled()) this.logJson(createGroupOutput)
    return createGroupOutput
  }
}
