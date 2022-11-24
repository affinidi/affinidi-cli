import { CliUx, Command, Interfaces } from '@oclif/core'

import { buildInvalidCommandUsage, configCommandDescription } from '../../render/texts'

export default class Config extends Command {
  static command = 'affinidi config'

  static summary = 'The config commmand allows to set various settings for cli.'

  static usage = 'config [COMMAND] [ARGS...]'

  static description = configCommandDescription

  static examples: Interfaces.Example[] = [
    {
      description: 'Configures output format view:',
      command: '$ <%= config.bin %> <%= command.id %> output',
    },
    {
      description: 'Configures errors format view:',
      command: '$ <%= config.bin %> <%= command.id %> error',
    },
  ]

  public async run(): Promise<void> {
    CliUx.ux.info(buildInvalidCommandUsage(Config.command, Config.usage, Config.summary))
  }
}
