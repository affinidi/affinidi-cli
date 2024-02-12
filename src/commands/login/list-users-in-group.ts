import { select } from '@inquirer/prompts'
import { ux, Flags } from '@oclif/core'
import z from 'zod'
import { BaseCommand } from '../../common'
import { promptRequiredParameters } from '../../common/prompts'
import { INPUT_LIMIT, MAX_ITEMS_LIMIT } from '../../common/validators'
import { vpAdapterService } from '../../services/affinidi/vp-adapter'
import { GroupUserMappingsList } from '../../services/affinidi/vp-adapter/vp-adapter.api'

const NEXT = 'Next'
const PREVIOUS = 'Previous'

export class ListUsersInGroup extends BaseCommand<typeof ListUsersInGroup> {
  static summary = 'Use this command to list users in the user group'
  static examples = ['<%= config.bin %> <%= command.id %> --group-name my_group']
  static flags = {
    'group-name': Flags.string({
      summary: 'Name of the user group',
    }),
    'page-size': Flags.integer({
      summary: "The total number of items to return in the command's output",
      max: 20,
    }),
    'starting-token': Flags.string({
      summary: 'A token to specify where to start paginating',
    }),
    'last-evaluated-keys': Flags.string({
      summary: 'A comma seperated string containing all las evaluated keys',
      hidden: true,
    }),
  }
  static pageNumber = 1

  public async run(): Promise<GroupUserMappingsList> {
    const { flags } = await this.parse(ListUsersInGroup)
    const promptFlags = await promptRequiredParameters(['group-name'], flags)
    const schema = z.object({
      'group-name': z.string().max(INPUT_LIMIT),
      'page-size': z.number().optional(),
      'starting-token': z.string().optional(),
      'last-evaluated-keys': z.string().optional(),
    })
    const validatedFlags = schema.parse(promptFlags)
    const pageSize = validatedFlags['page-size'] ?? MAX_ITEMS_LIMIT

    ux.action.start('Fetching users in the user group')
    const listGroupUsersOutput = await vpAdapterService.listGroupUsers(validatedFlags['group-name'], {
      limit: pageSize,
      exclusiveStartKey: validatedFlags['starting-token'] ?? undefined,
    })
    ux.action.stop('Fetched successfully!')

    const { lastEvaluatedKey, ...rest } = listGroupUsersOutput
    let lastEvalKeys = validatedFlags['last-evaluated-keys'] ?? ''
    if (!this.jsonEnabled())
      this.logJson({
        ...rest,
        'starting-token': lastEvaluatedKey,
        'previous-starting-token': lastEvalKeys.split(',').slice(-2, -1).pop(),
      })

    if (lastEvaluatedKey || lastEvalKeys) {
      const totalPages = Math.ceil(listGroupUsersOutput.totalUserCount! / pageSize)
      const choices = [{ value: NEXT }, { value: PREVIOUS }, { value: 'Exit' }]

      if (ListUsersInGroup.pageNumber === 1) choices.splice(1, 1)
      if (!lastEvaluatedKey) choices.splice(0, 1)

      const selected = await select({
        message: `Showing page ${ListUsersInGroup.pageNumber}/${totalPages}`,
        choices: choices,
      })

      if (selected === NEXT && lastEvaluatedKey) {
        ListUsersInGroup.pageNumber++
        lastEvalKeys += lastEvaluatedKey + ','
        const pageSizeFlag = pageSize ? [`--page-size=${pageSize}`] : []
        await this.config.runCommand('login:list-users-in-group', [
          `--group-name=${validatedFlags['group-name']}`,
          `--starting-token=${lastEvaluatedKey}`,
          `--last-evaluated-keys=${lastEvalKeys}`,
          ...pageSizeFlag,
        ])
      } else if (selected === PREVIOUS) {
        ListUsersInGroup.pageNumber--
        const pageSizeFlag = pageSize ? [`--page-size=${pageSize}`] : []
        const lastEvalKeysArray = lastEvalKeys.split(',').slice(0, -2)
        const previuosStartingToken = lastEvalKeysArray.pop()
        const lastEvaluatedKeysFlag = lastEvalKeysArray.length
          ? [`--last-evaluated-keys=${lastEvalKeysArray.join(',')}`]
          : []
        const startingTokenFlag = previuosStartingToken ? [`--starting-token=${previuosStartingToken}`] : []

        await this.config.runCommand('login:list-users-in-group', [
          `--group-name=${validatedFlags['group-name']}`,
          ...startingTokenFlag,
          ...lastEvaluatedKeysFlag,
          ...pageSizeFlag,
        ])
      }
    }
    ListUsersInGroup.pageNumber = 0
    return listGroupUsersOutput
  }
}
