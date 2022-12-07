import { Command, Flags, Interfaces } from '@oclif/core'

import { configService } from '../../services'
import { ViewFormat } from '../../constants'
import { displayOutput } from '../../middleware/display'

import { buildInvalidCommandUsage, configCommandDescription } from '../../render/texts'

export default class Config extends Command {
  static command = 'affinidi config'

  static summary = 'The config commmand allows to set various settings for cli.'

  static usage = 'config [COMMAND] [ARGS...]'

  static description = configCommandDescription

  static examples: Interfaces.Example[] = [
    {
      description: 'Configures output format view:',
      command: '$ <%= config.bin %> <%= command.id %> view',
    },
  ]

  static flags = {
    'unset-all': Flags.boolean({
      char: 'u',
      description: 'remove username from config',
      default: false,
    }),
    output: Flags.enum<ViewFormat>({
      char: 'o',
      description: 'set flag to override default output format view',
      options: ['json', 'plaintext'],
    }),
  }

  public async run(): Promise<void> {
    const { flags } = await this.parse(Config)
    const { 'unset-all': unsetAll, output } = flags
    if (unsetAll) {
      configService.deleteUserConfig()
      displayOutput({ itemToDisplay: 'Your configuration is unset', flag: output })
    }
    displayOutput({
      itemToDisplay: buildInvalidCommandUsage(Config.command, Config.usage, Config.summary),
    })
  }
}
