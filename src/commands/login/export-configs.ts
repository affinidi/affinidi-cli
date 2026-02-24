import { writeFile } from 'fs/promises'
import { checkbox, input } from '@inquirer/prompts'
import { Flags, ux } from '@oclif/core'
import { CLIError } from '@oclif/core/errors'
import { BaseCommand } from '../../common/base-command.js'
import { giveFlagInputErrorMessage } from '../../common/error-messages.js'
import { validateInputLength } from '../../common/validators.js'
import { bffService } from '../../services/affinidi/bff-service.js'
import { vpAdapterService } from '../../services/affinidi/vp-adapter/service.js'
import { INPUT_LIMIT } from '../../common/constants.js'

export class ExportLoginConfigs extends BaseCommand<typeof ExportLoginConfigs> {
  static summary = 'Export selected login configurations of your active project'
  static examples = [
    '<%= config.bin %> <%= command.id %>',
    '<%= config.bin %> <%= command.id %> --ids "configurationId1 configurationId2" --path "../my-configs.json"',
  ]

  static flags = {
    ids: Flags.string({
      char: 'i',
      summary: 'IDs of the login configurations to export, separated by space',
    }),
    path: Flags.string({
      char: 'p',
      summary: 'Relative or absolute path where configurations should be exported',
    }),
  }

  public async run(): Promise<string[]> {
    const { flags } = await this.parse(ExportLoginConfigs)

    if (flags['no-input']) {
      if (!flags.ids) throw new CLIError(giveFlagInputErrorMessage('ids'))
      if (!flags.path) throw new CLIError(giveFlagInputErrorMessage('path'))
    }

    const path =
      flags.path ??
      validateInputLength(
        await input({ message: 'Enter relative or absolute path where configurations should be exported' }),
        INPUT_LIMIT,
      )

    let configIds = flags.ids?.split(' ')

    if (!configIds || configIds.length === 0) {
      const listLoginConfigs = await vpAdapterService.listLoginConfigurations()
      const selectConfigMap = listLoginConfigs.configurations.map(({ configurationId, name }) => ({
        configurationId,
        name,
      }))

      configIds = (await checkbox({
        message: 'Select configurations to export',
        choices: selectConfigMap.map((config) => ({
          name: `${config.name} [${config.configurationId}]`,
          value: config.configurationId,
        })),
        required: true,
      })) as string[]
    }

    ux.action.start('Exporting login configurations')
    const data = await bffService.exportLoginConfigs(configIds)

    await writeFile(path, JSON.stringify({ data }), 'utf-8')
    ux.action.stop('Exported successfully!')

    if (!this.jsonEnabled()) this.logJson(configIds)
    return configIds
  }
}
