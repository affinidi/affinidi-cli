import { writeFile } from 'fs/promises'
import checkbox from '@inquirer/checkbox'
import { input } from '@inquirer/prompts'
import { Flags, ux } from '@oclif/core'
import { CLIError } from '@oclif/core/lib/errors'
import { BaseCommand } from '../../common'
import { giveFlagInputErrorMessage } from '../../common/error-messages'
import { INPUT_LIMIT, validateInputLength } from '../../common/validators'
import { bffService } from '../../services/affinidi/bff-service'
import { vpAdapterService } from '../../services/affinidi/vp-adapter'

export class ExportGroups extends BaseCommand<typeof ExportGroups> {
  static summary = 'Export selected user groups with its users'
  static examples = [
    '<%= config.bin %> <%= command.id %>',
    '<%= config.bin %> <%= command.id %> --names "groupName1 groupName2" --path "../my-user-groups.json"',
  ]

  static flags = {
    names: Flags.string({
      char: 'n',
      summary: 'Group names to export, separated by space',
    }),
    path: Flags.string({
      char: 'p',
      summary: 'Relative or absolute path where user groups should be exported',
    }),
  }

  public async run(): Promise<any> {
    const { flags } = await this.parse(ExportGroups)

    if (flags['no-input']) {
      if (!flags.names) throw new CLIError(giveFlagInputErrorMessage('names'))
      if (!flags.path) throw new CLIError(giveFlagInputErrorMessage('path'))
    }

    const path =
      flags.path ??
      validateInputLength(
        await input({ message: 'Enter relative or absolute path where user groups should be exported' }),
        INPUT_LIMIT,
      )

    let groupNames = flags.names?.split(' ') || []

    if (!groupNames || groupNames.length === 0) {
      const listUserGroups = await vpAdapterService.listGroups()
      const selectGroupMap = listUserGroups?.groups?.map(({ groupName }) => ({ groupName })) || []

      groupNames = (await checkbox({
        message: 'Select groups to export',
        choices: selectGroupMap.map((group) => ({
          name: group.groupName,
          value: group.groupName,
        })),
        required: true,
      })) as string[]
    }

    ux.action.start('Exporting groups')
    const data = await bffService.exportGroups(groupNames)

    await writeFile(path, JSON.stringify({ data }), 'utf-8')
    ux.action.stop('Exported successfully!')

    if (!this.jsonEnabled()) this.logJson(groupNames)
    return groupNames
  }
}
