import { ux, Flags } from '@oclif/core'
import { z } from 'zod'
import { BaseCommand } from '../../common'
import { promptRequiredParameters } from '../../helpers'
import { INPUT_LIMIT } from '../../helpers/input-length-validation'
import { clientSDK } from '../../services/affinidi'
import { iamService } from '../../services/affinidi/iam'

export class DeleteToken extends BaseCommand<typeof DeleteToken> {
  static summary = 'Deletes a Personal Access Token (PAT)'
  static examples = [
    '<%= config.bin %> <%= command.id %> -i <uuid>',
    '<%= config.bin %> <%= command.id %> --token-id <uuid>',
  ]
  static flags = {
    'token-id': Flags.string({
      char: 'i',
      description: 'ID of the Personal Access Token',
    }),
  }

  public async run(): Promise<{ id: string }> {
    const { flags } = await this.parse(DeleteToken)
    const promptFlags = await promptRequiredParameters(['token-id'], flags)

    const schema = z.string().max(INPUT_LIMIT).uuid()
    const tokenId = schema.parse(promptFlags['token-id'])

    ux.action.start('Deleting Personal Access Token')
    await iamService.deleteMachineUser(clientSDK.config.getUserToken()?.access_token, tokenId)
    ux.action.stop('Deleted successfully!')

    if (!this.jsonEnabled()) this.logJson({ id: tokenId })
    return { id: tokenId }
  }
}
