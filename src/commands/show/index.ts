import { CliUx, Command, Interfaces } from '@oclif/core'

import { showCommandDescription } from '../../render/texts'

export default class Show extends Command {
  static summary = 'The Show commmand to display the detail of a ressource'

  static description = showCommandDescription

  static examples: Interfaces.Example[] = [
    {
      description: 'Shows the details of a schema',
      command: '$ <%= config.bin %> <%= command.id %> schema [<schema-id>] [--output json]',
    },
    {
      description: 'Shows information about a specific project that you own.',
      command: '$ <%= config.bin %> <%= command.id %> [<project-id>] [--output json]',
    },
  ]

  public async run(): Promise<void> {
    CliUx.ux.log(Show.summary)
    CliUx.ux.log(Show.description)
  }
}
