import { confirm, select } from '@inquirer/prompts'
import { ux, Flags } from '@oclif/core'
import z from 'zod'
import { BaseCommand } from '../../common'
import { promptRequiredParameters } from '../../common/prompts'
import { INPUT_LIMIT, MAX_ITEMS_LIMIT } from '../../common/validators'
import { vpAdapterService } from '../../services/affinidi/vp-adapter'
import { GroupUserMappingsList } from '../../services/affinidi/vp-adapter/vp-adapter.api'

const NEXT = 'Next'
const PREVIOUS = 'Previous'
const EXIT = 'Exit'

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
  }
  static pageNumber = 1
  static lastEvalutatedKeys = ''

  public async run(): Promise<GroupUserMappingsList> {
    const { flags } = await this.parse(ListUsersInGroup)
    const promptFlags = await promptRequiredParameters(['group-name'], flags)
    const schema = z.object({
      'group-name': z.string().max(INPUT_LIMIT),
      'page-size': z.number().optional(),
      'starting-token': z.string().optional(),
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
    let lastEvalKeys = ListUsersInGroup.lastEvalutatedKeys ?? ''
    if (!this.jsonEnabled())
      this.logJson({
        ...rest,
        'starting-token': lastEvaluatedKey,
      })

    if (
      (lastEvaluatedKey || lastEvalKeys) &&
      !flags['no-input'] &&
      !(validatedFlags['starting-token'] && ListUsersInGroup.pageNumber === 1)
    ) {
      const totalPages = Math.ceil(listGroupUsersOutput.totalUserCount! / pageSize)
      const choices = [{ value: NEXT }, { value: PREVIOUS }, { value: EXIT }]

      if (ListUsersInGroup.pageNumber === 1) choices.splice(1, 1)
      if (!lastEvaluatedKey) choices.splice(0, 1)

      let selected = await select({ choices, message: `Showing page ${ListUsersInGroup.pageNumber}/${totalPages}` })

      if (selected === EXIT) {
        const exitConfirmation = await confirm({ message: 'Are you sure you want to exit pagination?' })
        if (!exitConfirmation) {
          selected = await select({ choices, message: `Showing page ${ListUsersInGroup.pageNumber}/${totalPages}` })
        }
      }

      if (selected === NEXT && lastEvaluatedKey) {
        ListUsersInGroup.pageNumber++
        lastEvalKeys += lastEvaluatedKey + ','
        ListUsersInGroup.lastEvalutatedKeys = lastEvalKeys
        const pageSizeFlag = pageSize ? [`--page-size=${pageSize}`] : []
        await this.config.runCommand('login:list-users-in-group', [
          `--group-name=${validatedFlags['group-name']}`,
          `--starting-token=${lastEvaluatedKey}`,
          ...pageSizeFlag,
        ])
      } else if (selected === PREVIOUS) {
        ListUsersInGroup.pageNumber--
        const pageSizeFlag = pageSize ? [`--page-size=${pageSize}`] : []
        const lastEvalKeysArray = lastEvalKeys.split(',').slice(0, -2)
        const previuosStartingToken = lastEvalKeysArray.pop()
        ListUsersInGroup.lastEvalutatedKeys = lastEvalKeysArray.length ? lastEvalKeysArray.join(',') : ''
        const startingTokenFlag = previuosStartingToken ? [`--starting-token=${previuosStartingToken}`] : []
        await this.config.runCommand('login:list-users-in-group', [
          `--group-name=${validatedFlags['group-name']}`,
          ...startingTokenFlag,
          ...pageSizeFlag,
        ])
      }
    }
    ListUsersInGroup.pageNumber = 0
    return listGroupUsersOutput
  }
}
