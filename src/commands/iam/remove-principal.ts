import { select } from '@inquirer/prompts'
import { Flags, ux } from '@oclif/core'
import { CLIError } from '@oclif/core/errors'
import chalk from 'chalk'
import { z } from 'zod'
import { BaseCommand } from '../../common/base-command.js'
import { INPUT_LIMIT, PrincipalTypes } from '../../common/constants.js'
import { giveFlagInputErrorMessage } from '../../common/error-messages.js'
import { promptRequiredParameters } from '../../common/prompts.js'

import { iamService } from '../../services/affinidi/iam/service.js'

export class RemovePrincipal extends BaseCommand<typeof RemovePrincipal> {
  static summary = 'Removes a principal (user or token) from the active project'
  static description = `To change your active project, use command ${chalk.inverse('affinidi project select-project')}`
  static examples = [
    '<%= config.bin %> <%= command.id %> -i <uuid>',
    '<%= config.bin %> <%= command.id %> --principal-id <uuid> --principal-type token',
  ]
  static flags = {
    'principal-id': Flags.string({
      char: 'i',
      summary: 'ID of the principal',
      description: `Get a list of possible IDs with command ${chalk.inverse('affinidi token list-tokens')}`,
    }),
    'principal-type': Flags.string({
      char: 't',
      summary: 'Type of the principal',
      options: Object.values(PrincipalTypes),
    }),
  }

  public async run(): Promise<{
    'principal-id': string
    'principal-type': PrincipalTypes
  }> {
    const { flags } = await this.parse(RemovePrincipal)
    const promptFlags = await promptRequiredParameters(['principal-id'], flags)
    if (flags['no-input']) {
      if (!promptFlags['principal-type']) {
        throw new CLIError(giveFlagInputErrorMessage('principal-type'))
      }
    }
    promptFlags['principal-type'] ??= await select({
      message: 'Select the principal-type',
      choices: Object.values(PrincipalTypes).map((value) => ({
        name: value,
        value,
      })),
    })
    const schema = z.object({
      'principal-id': z.string().max(INPUT_LIMIT).uuid(),
      'principal-type': z.nativeEnum(PrincipalTypes),
    })
    const validatedFlags = schema.parse(promptFlags)

    ux.action.start('Removing principal from project')
    await iamService.deletePrincipalFromProject(validatedFlags['principal-id'], validatedFlags['principal-type'])
    ux.action.stop('Removed successfully!')

    if (!this.jsonEnabled()) this.logJson(validatedFlags)
    return validatedFlags
  }
}
