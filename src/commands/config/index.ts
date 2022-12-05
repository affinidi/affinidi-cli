import { Command, Interfaces } from '@oclif/core'
import { getSession } from '../../services/user-management'
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

  public async run(): Promise<void> {
    displayOutput({
      itemToDisplay: buildInvalidCommandUsage(Config.command, Config.usage, Config.summary),
    })
  }
}
