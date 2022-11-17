import { CliUx, Command, Interfaces } from '@oclif/core'

import { useCommandDescription, buildInvalidCommandUsage } from '../../render/texts'

export default class Use extends Command {
  static command = 'affinidi use'
  static summary = 'The use command selects an entity to work with.'
  static usage = 'use [COMMAND] [ARGS...]'

  static description = useCommandDescription

  static examples: Interfaces.Example[] = [
    {
      description: 'Use a given project',
      command: '$ <%= config.bin %> <%= command.id %> [project-id]',
    },
  ]

  public async run(): Promise<void> {
    CliUx.ux.info(buildInvalidCommandUsage(Use.command, Use.usage, Use.summary))
  }
}
