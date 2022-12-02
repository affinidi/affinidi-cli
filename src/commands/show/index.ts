import { Command, Interfaces } from '@oclif/core'
import { displayOutput } from '../../middleware/display'

import { showCommandDescription, buildInvalidCommandUsage } from '../../render/texts'

export default class Show extends Command {
  static command = 'affinidi show'

  static summary = 'Shows the details of a resource'

  static description = showCommandDescription

  static usage = 'show [COMMAND] [ARG...]'

  static examples: Interfaces.Example[] = [
    {
      description: 'Shows the details of a schema:',
      command: '$ <%= config.bin %> <%= command.id %> schema [<schema-id>] [--output json]',
    },
    {
      description: 'Shows information about a specific project that you own:',
      command: '$ <%= config.bin %> <%= command.id %> project [<project-id>] [--output json]',
    },
  ]

  public async run(): Promise<void> {
    displayOutput({
      itemToDisplay: buildInvalidCommandUsage(Show.command, Show.usage, Show.summary),
    })
  }
}
