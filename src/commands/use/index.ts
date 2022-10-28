import { CliUx, Command, Interfaces } from '@oclif/core'

import { useCommandDescription } from '../../render/texts'

export default class Use extends Command {
  static summary = 'The Use commmand selects an entity to work with'

  static description = useCommandDescription

  static examples: Interfaces.Example[] = [
    {
      description: 'Use a given project',
      command: '$ <%= config.bin %> <%= command.id %> use [<project-id>]',
    },
  ]

  public async run(): Promise<void> {
    CliUx.ux.log(Use.summary)
    CliUx.ux.log(Use.description)
  }
}
