import { CliUx, Command } from '@oclif/core'
import { StatusCodes } from 'http-status-codes'

import { configService } from '../../services/config'
import { CliError, getErrorOutput, Unauthorized } from '../../errors'
import { isAuthenticated } from '../../middleware/authentication'
import { vaultService, VAULT_KEYS } from '../../services'
import { getSession } from '../../services/user-management'
import { displayOutput } from '../../middleware/display'

export default class View extends Command {
  static command = 'affinidi config view'

  static description = 'Use this command to configure the format of output'

  static examples = ['<%= config.bin %> <%= command.id %>']

  static usage = 'config view [plaintext | json]'

  static args = [
    {
      name: 'format',
      required: true,
      options: ['plaintext', 'json'],
      description: 'format of the output',
    },
  ]

  public async run(): Promise<void> {
    const { args } = await this.parse(View)
    const { format } = args
    if (!isAuthenticated()) {
      throw new CliError(Unauthorized, StatusCodes.UNAUTHORIZED, 'userManagement')
    }
    const userId = getSession()?.account?.id

    configService.setOutputFormat(userId, format)
    displayOutput(`Default output format view is set to ${format}`, userId)
  }

  async catch(error: CliError) {
    CliUx.ux.action.stop('failed')
    const userId = JSON.parse(vaultService.get(VAULT_KEYS.session))?.account?.id
    const outputFormat = configService.getOutputFormat(userId)

    CliUx.ux.info(
      getErrorOutput(
        error,
        View.command,
        View.usage,
        View.description,
        outputFormat !== 'plaintext',
      ),
    )
  }
}
