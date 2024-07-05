import { readFile } from 'fs/promises'
import { confirm, input, select } from '@inquirer/prompts'
import { ux, Flags } from '@oclif/core'
import { CLIError } from '@oclif/core/lib/errors'
import chalk from 'chalk'
import { z } from 'zod'
import { BaseCommand, PrincipalTypes } from '../../common'
import { giveFlagInputErrorMessage } from '../../common/error-messages'
import { promptRequiredParameters } from '../../common/prompts'
import { INPUT_LIMIT, policiesDataSchema, validateInputLength } from '../../common/validators'
import { bffService } from '../../services/affinidi/bff-service'
import { iamService } from '../../services/affinidi/iam'
import { PolicyDto } from '../../services/affinidi/iam/iam.api'

export class UpdatePolicies extends BaseCommand<typeof UpdatePolicies> {
  static summary = 'Updates the policies of a principal (user or token) in the active project'
  static description = `Make sure the principal you are working with is part of the active project\n\
    Use command ${chalk.inverse('affinidi project select-project')} to change your active project`
  static examples = [
    '<%= config.bin %> <%= command.id %> -i <uuid>',
    '<%= config.bin %> <%= command.id %> --principal-id <uuid> --principal-type token --file policies.json',
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
    file: Flags.string({
      char: 'f',
      summary: 'Location of a json file containing principal policies',
    }),
  }

  public async run(): Promise<PolicyDto> {
    const { flags } = await this.parse(UpdatePolicies)
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
    const flagsSchema = z.object({
      'principal-id': z.string().max(INPUT_LIMIT).uuid(),
      'principal-type': z.nativeEnum(PrincipalTypes),
      file: z.string().optional(),
    })
    const validatedFlags = flagsSchema.parse(promptFlags)

    let policiesData = null
    if (validatedFlags.file) {
      const rawData = await readFile(validatedFlags.file, 'utf8')
      try {
        policiesData = JSON.parse(rawData)
      } catch (error) {
        throw new CLIError(`Provided file is not a valid JSON\n${(error as Error).message}`)
      }
    } else {
      if (flags['no-input']) {
        throw new CLIError(giveFlagInputErrorMessage('file'))
      }
      this.log(
        `Assigning a single policy statement to a principal. To assign multiple statements please use the ${chalk.inverse(
          '--file',
        )} flag instead.`,
      )
      this.warn('\nThis will override the existing principal statements')
      const resourceFilters = validateInputLength(
        await input({
          message: 'Enter the allowed resources, separated by spaces. Use * to allow access to all project resources',
          default: '*',
        }),
        INPUT_LIMIT,
      )
      const actions = validateInputLength(
        await input({
          message: 'Enter the allowed actions, separated by spaces. Use * to allow all actions',
          default: '*',
        }),
        INPUT_LIMIT,
      )

      const activeProject = await bffService.getActiveProject()

      policiesData = {
        version: '2022-12-15',
        statement: [
          {
            principal: [
              `ari:iam::${activeProject.id}:${validatedFlags['principal-type']}/${validatedFlags['principal-id']}`,
            ],
            action: actions.split(' '),
            resource: resourceFilters.split(' '),
            effect: 'Allow',
          },
        ],
      }
    }
    const validatedPolicies = policiesDataSchema.parse(policiesData)

    this.log(`The following policies will be updated for principal ${chalk.inverse(validatedFlags['principal-id'])}:`)
    this.logJson(validatedPolicies)

    if (!flags['no-input']) {
      const confirmPolicies = await confirm({
        message: 'Update policies?',
      })

      if (!confirmPolicies) {
        throw new CLIError('Action canceled')
      }
    }
    ux.action.start('Updating principal policies')
    const out = await iamService.updatePolicies(
      validatedFlags['principal-id'],
      validatedFlags['principal-type'],
      validatedPolicies,
    )
    ux.action.stop('Updated successfully!')

    if (!this.jsonEnabled()) this.logJson(out)
    return out
  }
}
