import { Flags, ux } from '@oclif/core'
import chalk from 'chalk'
import { z } from 'zod'
import { BaseCommand, PrincipalTypes } from '../../common'
import { promptRequiredParameters } from '../../helpers'
import { clientSDK } from '../../services/affinidi'
import { iamService } from '../../services/affinidi/iam'

export class RemovePrincipal extends BaseCommand<typeof RemovePrincipal> {
  static summary = 'Removes a principal (user or token) from the active project'
  static description = `To change your active project, use command ${chalk.inverse('affinidi project select-project')}`
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
      default: PrincipalTypes.TOKEN,
    }),
  }

  public async run(): Promise<{
    'principal-id': string
    'principal-type': PrincipalTypes
  }> {
    const { flags } = await this.parse(RemovePrincipal)
    const promptFlags = await promptRequiredParameters(['principal-id'], flags)
    const schema = z.object({
      'principal-id': z.string().uuid(),
      'principal-type': z.nativeEnum(PrincipalTypes),
    })
    const validatedFlags = schema.parse(promptFlags)

    ux.action.start('Removing principal from project')
    await iamService.deletePrincipalFromProject(
      clientSDK.config.getProjectToken()?.projectAccessToken,
      validatedFlags['principal-id'],
      validatedFlags['principal-type'],
    )
    ux.action.stop('Removed successfully!')

    if (!this.jsonEnabled()) this.logJson(validatedFlags)
    return validatedFlags
  }
}
