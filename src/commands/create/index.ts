import { Command, Interfaces } from '@oclif/core'
import { displayOutput } from '../../middleware/display'

import { listCommandDescription, buildInvalidCommandUsage } from '../../render/texts'

export default class Create extends Command {
  static command = 'affinidi create'

  static summary = 'Use this command to create a new Affinidi project.'

  static usage = 'create [COMMAND] [ARGS...]'

  static description = listCommandDescription

  static examples: Interfaces.Example[] = [
    {
      description: 'creates a new project:',
      command: '$ <%= config.bin %> <%= command.id %> project',
    },
    {
      description: 'creates a new schemas:',
      command: '$ <%= config.bin %> <%= command.id %> schema',
    },
  ]

  public async run(): Promise<void> {
    displayOutput({
      itemToDisplay: buildInvalidCommandUsage(Create.command, Create.usage, Create.summary),
    })
  }
}
