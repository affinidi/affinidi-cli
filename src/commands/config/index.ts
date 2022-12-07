import { Command, Flags, Interfaces } from '@oclif/core'
import { StatusCodes } from 'http-status-codes'

import { configService } from '../../services'
import { ViewFormat } from '../../constants'
import { displayOutput } from '../../middleware/display'
import { buildInvalidCommandUsage, configCommandDescription } from '../../render/texts'
import { isAuthenticated } from '../../middleware/authentication'
import { CliError, Unauthorized } from '../../errors'

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
    {
      description:
        'Persist username in config file, to login afterwards without providing your username:',
      command: '$ <%= config.bin %> <%= command.id %> username',
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
    if (!isAuthenticated()) {
      throw new CliError(Unauthorized, StatusCodes.UNAUTHORIZED, 'config')
    }
    const { 'unset-all': unsetAll, output } = flags
    if (unsetAll) {
      configService.deleteUserConfig()
      displayOutput({ itemToDisplay: 'Your configuration is unset', flag: output })
      return
    }
    displayOutput({
      itemToDisplay: buildInvalidCommandUsage(Config.command, Config.usage, Config.summary),
    })
  }
}
