import { confirm } from '@inquirer/prompts'
import { ux, Flags } from '@oclif/core'
import z from 'zod'
import { BaseCommand } from '../../common'
import { promptRequiredParameters } from '../../common/prompts'
import { INPUT_LIMIT, MAX_ITEMS_LIMIT } from '../../common/validators'
import { vpAdapterService } from '../../services/affinidi/vp-adapter'
import { GroupUserMappingsList } from '../../services/affinidi/vp-adapter/vp-adapter.api'

export class ListUsersInGroup extends BaseCommand<typeof ListUsersInGroup> {
  static summary = 'Use this command to list users in the user group'
  static examples = ['<%= config.bin %> <%= command.id %> --group-name my_group']
  static flags = {
    'group-name': Flags.string({
      summary: 'Name of the user group',
    }),
    'max-items': Flags.integer({
      summary: "The total number of items to return in the command's output",
      max: MAX_ITEMS_LIMIT,
    }),
    'starting-token': Flags.string({
      summary: 'A token to specify where to start paginating',
    }),
  }

  public async run(): Promise<GroupUserMappingsList> {
    const { flags } = await this.parse(ListUsersInGroup)
    const promptFlags = await promptRequiredParameters(['group-name'], flags)
    const schema = z.object({
      'group-name': z.string().max(INPUT_LIMIT),
      'max-items': z.number().optional(),
      'starting-token': z.string().optional(),
    })
    const validatedFlags = schema.parse(promptFlags)

    ux.action.start('Fetching users in the user group')
    const listGroupUsersOutput = await vpAdapterService.listGroupUsers(validatedFlags['group-name'], {
      limit: validatedFlags['max-items'] ?? MAX_ITEMS_LIMIT,
      exclusiveStartKey: validatedFlags['starting-token'] ?? undefined,
    })
    ux.action.stop('Fetched successfully!')
    const { lastEvaluatedKey, ...rest } = listGroupUsersOutput
    if (!this.jsonEnabled()) this.logJson({ ...rest, 'starting-token': lastEvaluatedKey })

    if (listGroupUsersOutput.lastEvaluatedKey && (await confirm({ message: 'Do you want to fetch next page?' }))) {
      const maxItemsFlag = validatedFlags['max-items'] ? [`--max-items=${validatedFlags['max-items']}`] : []
      await this.config.runCommand('login:list-users-in-group', [
        `--group-name=${validatedFlags['group-name']}`,
        `--starting-token=${listGroupUsersOutput.lastEvaluatedKey}`,
        ...maxItemsFlag,
      ])
    }

    return listGroupUsersOutput
  }
}
