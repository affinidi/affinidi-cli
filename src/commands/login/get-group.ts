import { GroupDto } from '@affinidi-tdk/login-configuration-client'
import { ux, Flags } from '@oclif/core'
import z from 'zod'
import { BaseCommand } from '../../common/base-command.js'
import { promptRequiredParameters } from '../../common/prompts.js'
import { INPUT_LIMIT } from '../../common/validators.js'
import { vpAdapterService } from '../../services/affinidi/vp-adapter/service.js'

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
    const schema = z.object({
      name: z.string().max(INPUT_LIMIT),
    })
    const validatedFlags = schema.parse(promptFlags)

    ux.action.start('Fetching user group')
    const getGroupOutput = await vpAdapterService.getGroup(validatedFlags.name)
    ux.action.stop('Fetched successfully!')

    if (!this.jsonEnabled()) this.logJson(getGroupOutput)
    return getGroupOutput
  }
}
