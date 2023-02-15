import { ux, Command, Flags } from '@oclif/core'
import { StatusCodes } from 'http-status-codes'

import { configService } from '../../services'
import { DisplayOptions, displayOutput } from '../../middleware/display'
import { buildInvalidCommandUsage, configCommandDescription } from '../../render/texts'
import { isAuthenticated } from '../../middleware/authentication'
import { CliError, getErrorOutput, Unauthorized } from '../../errors'
import { output } from '../../customFlags/outputFlag'

export default class Config extends Command {
  static command = 'affinidi config'

  static summary = 'Use this command to delete user saved configurations.'

  static usage = 'config [COMMAND] [ARGS...]'

  static description = configCommandDescription

  static examples: Command.Example[] = [
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
      description: 'remove user configuration from config file',
      default: false,
    }),

    output,
  }

  public async run(): Promise<void> {
    const { flags } = await this.parse(Config)
    if (!isAuthenticated()) {
      throw new CliError(Unauthorized, StatusCodes.UNAUTHORIZED, 'config')
    }
    const { 'unset-all': unsetAll, output: outputFlag } = flags
    if (unsetAll) {
      configService.deleteUserConfig()
      displayOutput({ itemToDisplay: 'Your configuration is unset', flag: outputFlag })
      return
    }
    displayOutput({
      itemToDisplay: buildInvalidCommandUsage(Config.command, Config.usage, Config.summary),
    })
  }

  async catch(error: CliError) {
    ux.action.stop('failed')
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
