import { select } from '@inquirer/prompts'
import { ux, Flags } from '@oclif/core'
import { CLIError } from '@oclif/core/errors'
import chalk from 'chalk'
import { z } from 'zod'
import { BaseCommand } from '../../common/base-command.js'
import { giveFlagInputErrorMessage } from '../../common/error-messages.js'
import { promptRequiredParameters } from '../../common/prompts.js'
import { INPUT_LIMIT } from '../../common/validators.js'
import { iamService } from '../../services/affinidi/iam/service.js'
import { PrincipalTypes } from '../../common/constants.js'

export class AddPrincipal extends BaseCommand<typeof AddPrincipal> {
  static summary = 'Adds a principal (user or token) to the active project'
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

  public async run(): Promise<void> {
    const { flags } = await this.parse(AddPrincipal)
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

    ux.action.start('Adding principal to project')
    await iamService.addPrincipalToProject({
      principalId: validatedFlags['principal-id'],
      principalType: validatedFlags['principal-type'],
    })
    ux.action.stop('Added successfully!')
  }
}
