import { CliUx, Command, Interfaces } from '@oclif/core'

import { listCommandDescription } from '../../render/texts'

export default class List extends Command {
  static summary = 'The list commmand to display various resources'

  static description = listCommandDescription

  static examples: Interfaces.Example[] = [
    {
      description: 'Shows you the list of your projects',
      command: '$ <%= config.bin %> <%= command.id %> projects',
    },
    {
      description: 'Shows a list of available schemas',
      command: '$ <%= config.bin %> <%= command.id %> schemas',
    },
  ]

  public async run(): Promise<void> {
    CliUx.ux.log(List.summary)
    CliUx.ux.log(List.description)
  }
}
