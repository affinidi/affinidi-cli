import { select } from '@inquirer/prompts'
import { ux, Flags } from '@oclif/core'
import chalk from 'chalk'
import { z } from 'zod'
import { BaseCommand, PrincipalTypes } from '../../common'
import { promptRequiredParameters } from '../../helpers'
import { clientSDK } from '../../services/affinidi'
import { iamService } from '../../services/affinidi/iam'
import { PolicyDto } from '../../services/affinidi/iam/iam.api'

export class GetPolicies extends BaseCommand<typeof GetPolicies> {
  static summary = 'Gets the policies of a principal (user or token)'
  static description = `Make sure the principal you are working with is part of the active project\n\
    Use command ${chalk.inverse('affinidi project select-project')} to change your active project`
  static examples = [
    '<%= config.bin %> <%= command.id %> -i <uuid>',
    '<%= config.bin %> <%= command.id %> --principal-id <uuid> --principal-type machine_user',
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

  public async run(): Promise<PolicyDto> {
    const { flags } = await this.parse(GetPolicies)
    const promptFlags = await promptRequiredParameters(['principal-id'], flags)
    promptFlags['principal-type'] ??= await select({
      message: 'Select the principal-type',
      choices: Object.values(PrincipalTypes).map((value) => ({
        name: value,
        value,
      })),
    })
    const schema = z.object({
      'principal-id': z.string().uuid(),
      'principal-type': z.nativeEnum(PrincipalTypes),
    })
    const validatedFlags = schema.parse(promptFlags)

    ux.action.start('Fetching principal policies')
    const out = await iamService.getPolicies(
      clientSDK.config.getProjectToken()?.projectAccessToken,
      validatedFlags['principal-id'],
      validatedFlags['principal-type'],
    )
    ux.action.stop('Fetched successfully!')

    if (!this.jsonEnabled()) this.logJson(out)
    return out
  }
}
