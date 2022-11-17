import { CliUx, Command, Interfaces } from '@oclif/core'

import { listCommandDescription, buildInvalidCommandUsage } from '../../render/texts'

export default class List extends Command {
  static command = 'affinidi list'
  static summary = 'The list commmand to display various resources.'
  static usage = 'list [COMMAND] [ARGS...]'

  static description = listCommandDescription

  static examples: Interfaces.Example[] = [
    {
      description: 'Shows you the list of your projects:',
      command: '$ <%= config.bin %> <%= command.id %> projects',
    },
    {
      description: 'Shows a list of available schemas:',
      command: '$ <%= config.bin %> <%= command.id %> schemas',
    },
  ]

  public async run(): Promise<void> {
    CliUx.ux.info(buildInvalidCommandUsage(List.command, List.usage, List.summary))
  }
}
