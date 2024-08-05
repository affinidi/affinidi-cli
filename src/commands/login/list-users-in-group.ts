import { confirm, select } from '@inquirer/prompts'
import { ux, Flags } from '@oclif/core'
import z from 'zod'
import { BaseCommand } from '../../common/base-command.js'
import { promptRequiredParameters } from '../../common/prompts.js'
import { INPUT_LIMIT } from '../../common/validators.js'
import { vpAdapterService } from '../../services/affinidi/vp-adapter/service.js'
import { GroupUserMappingsList } from '../../services/affinidi/vp-adapter/vp-adapter.api.js'

const NEXT = 'Next'
const PREVIOUS = 'Previous'
const EXIT = 'Exit'
export const PAGE_SIZE_DEFAULT = 15

export class ListUsersInGroup extends BaseCommand<typeof ListUsersInGroup> {
  static summary = 'Use this command to list users in the user group'
  static examples = ['<%= config.bin %> <%= command.id %> --group-name my_group']
  static flags = {
    'group-name': Flags.string({
      summary: 'Name of the user group',
    }),
    'page-size': Flags.integer({
      summary: "The total number of items to return in the command's output",
    }),
    'starting-token': Flags.string({
      summary: 'A token to specify where to start paginating',
    }),
  }
  static pageNumber = 1
  static lastEvalutatedKeys = ''
  static middleListPrompting = {
    firstPage: false,
    startingTokenProvided: false,
    firstStartingToken: '',
  }

  public async run(): Promise<GroupUserMappingsList> {
    const { flags } = await this.parse(ListUsersInGroup)
    const promptFlags = await promptRequiredParameters(['group-name'], flags)
    const schema = z.object({
      'group-name': z.string().max(INPUT_LIMIT),
      'page-size': z.number().positive().optional(),
      'starting-token': z.string().optional(),
    })
    const validatedFlags = schema.parse(promptFlags)
    const pageSize = validatedFlags['page-size'] ?? PAGE_SIZE_DEFAULT
    const startingToken = validatedFlags['starting-token'] ?? undefined
    const groupName = validatedFlags['group-name']

    ux.action.start('Fetching users in the user group')
    const listGroupUsersOutput = await vpAdapterService.listGroupUsers(validatedFlags['group-name'], {
      limit: pageSize,
      exclusiveStartKey: startingToken,
    })
    ux.action.stop('Fetched successfully!')

    const { lastEvaluatedKey, ...rest } = listGroupUsersOutput
    if (!this.jsonEnabled())
      this.logJson({
        ...rest,
        'starting-token': lastEvaluatedKey,
      })
    const enablePromptingForPagination =
      (lastEvaluatedKey || ListUsersInGroup.lastEvalutatedKeys || ListUsersInGroup.pageNumber === 2) &&
      !flags['no-input']

    if (enablePromptingForPagination) {
      await this.paginationPrompting(
        startingToken,
        lastEvaluatedKey,
        listGroupUsersOutput.totalUserCount,
        pageSize,
        groupName,
      )
    }
    ListUsersInGroup.pageNumber = 0
    return listGroupUsersOutput
  }

  async paginationPrompting(
    startingToken: string | undefined,
    lastEvaluatedKey: string | undefined,
    totalUserCount: number | undefined,
    pageSize: number,
    groupName: string,
  ) {
    if (
      startingToken &&
      ListUsersInGroup.pageNumber === 1 &&
      !ListUsersInGroup.middleListPrompting.firstPage &&
      !ListUsersInGroup.middleListPrompting.startingTokenProvided
    ) {
      ListUsersInGroup.middleListPrompting = {
        firstPage: true,
        startingTokenProvided: true,
        firstStartingToken: startingToken,
      }
      ListUsersInGroup.lastEvalutatedKeys += startingToken + ','
    }

    if (ListUsersInGroup.middleListPrompting.firstStartingToken === startingToken)
      ListUsersInGroup.lastEvalutatedKeys = startingToken + ',' + ListUsersInGroup.lastEvalutatedKeys
    let totalPages = ListUsersInGroup.middleListPrompting.startingTokenProvided
      ? 'Page number information is not available'
      : totalUserCount
      ? Math.ceil(totalUserCount / pageSize).toString()
      : '1' || '1'
    totalPages = totalPages === '0' ? '1' : totalPages
    const choices = [{ value: NEXT }, { value: PREVIOUS }, { value: EXIT }]

    if (
      (ListUsersInGroup.pageNumber === 1 && !ListUsersInGroup.middleListPrompting.startingTokenProvided) ||
      ListUsersInGroup.middleListPrompting.firstPage
    ) {
      choices.splice(1, 1) // Remove PREVIOUS if on first page
    }
    if (!lastEvaluatedKey) choices.splice(0, 1) // Remove NEXT if no more pages

    const selectionMessage = ListUsersInGroup.middleListPrompting.startingTokenProvided
      ? totalPages
      : `Showing page ${ListUsersInGroup.pageNumber}/${totalPages}`

    await this.handleChoices(choices, selectionMessage, pageSize, startingToken, lastEvaluatedKey, groupName)
  }

  async handleChoices(
    choices: {
      value: string
    }[],
    selectionMessage: string,
    pageSize: number,
    startingToken: string | undefined,
    lastEvaluatedKey: string | undefined,
    groupName: string,
  ) {
    let paginationChoice = await select({
      choices,
      message: selectionMessage,
    })

    let shouldExit = false
    while (paginationChoice === EXIT && !shouldExit) {
      shouldExit = await confirm({ message: 'Are you sure you want to exit?' })
      if (!shouldExit) {
        paginationChoice = await select({
          choices,
          message: selectionMessage,
        })
      }
    }

    if (paginationChoice !== EXIT) {
      let startingTokenFlag: string[] = []
      const pageSizeFlag = pageSize ? [`--page-size=${pageSize}`] : []
      if (paginationChoice === NEXT && lastEvaluatedKey) {
        ListUsersInGroup.lastEvalutatedKeys += startingToken ? startingToken + ',' : ''
        if (!ListUsersInGroup.middleListPrompting.startingTokenProvided) ListUsersInGroup.pageNumber++
        if (ListUsersInGroup.middleListPrompting.firstPage) ListUsersInGroup.middleListPrompting.firstPage = false
        startingTokenFlag = [`--starting-token=${lastEvaluatedKey}`]
      } else if (paginationChoice === PREVIOUS) {
        if (!ListUsersInGroup.middleListPrompting.startingTokenProvided) ListUsersInGroup.pageNumber--
        const lastEvalKeysArray = ListUsersInGroup.lastEvalutatedKeys.split(',').slice(0, -1)
        const previuosStartingToken = lastEvalKeysArray.pop()
        if (ListUsersInGroup.middleListPrompting.firstStartingToken === previuosStartingToken) {
          ListUsersInGroup.middleListPrompting.firstPage = true
        }
        ListUsersInGroup.lastEvalutatedKeys = lastEvalKeysArray.length ? lastEvalKeysArray.join(',') + ',' : ''
        startingTokenFlag = previuosStartingToken ? [`--starting-token=${previuosStartingToken}`] : []
      }

      // Run command with updated flags
      await this.config.runCommand('login:list-users-in-group', [
        `--group-name=${groupName}`,
        ...startingTokenFlag,
        ...pageSizeFlag,
      ])
    }
  }
}
