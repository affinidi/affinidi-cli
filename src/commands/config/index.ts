import { CliUx, Command, Flags, Interfaces } from '@oclif/core'
import { StatusCodes } from 'http-status-codes'

import { configService } from '../../services'
import { ViewFormat } from '../../constants'
import { DisplayOptions, displayOutput } from '../../middleware/display'
import { buildInvalidCommandUsage, configCommandDescription } from '../../render/texts'
import { isAuthenticated } from '../../middleware/authentication'
import { CliError, getErrorOutput, Unauthorized } from '../../errors'

export default class Config extends Command {
  static command = 'affinidi config'

  static summary = 'Use this commmand to delete user saved configurations.'

  static usage = 'config [COMMAND] [ARGS...]'

  static description = configCommandDescription

  static examples: Interfaces.Example[] = [
    {
      description: 'Delete logged in user saved configuration:',
      command: '$ <%= config.bin %> <%= command.id %> --unset-all',
    },
    {
      description: 'Configure output format view:',
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

  async catch(error: CliError) {
    CliUx.ux.action.stop('failed')
    const outputFormat = configService.getOutputFormat()
    const optionsDisplay: DisplayOptions = {
      itemToDisplay: getErrorOutput(
        error,
        Config.command,
        Config.usage,
        Config.description,
        outputFormat !== 'plaintext',
      ),
      err: true,
    }
    try {
      const { flags } = await this.parse(Config)
      optionsDisplay.flag = flags.output
      displayOutput(optionsDisplay)
    } catch (_) {
      displayOutput(optionsDisplay)
    }
  }
}
