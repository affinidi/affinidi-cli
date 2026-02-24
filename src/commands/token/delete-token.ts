import { ux, Flags } from '@oclif/core'
import { z } from 'zod'
import { BaseCommand } from '../../common/base-command.js'
import { promptRequiredParameters } from '../../common/prompts.js'
import { INPUT_LIMIT } from '../../common/constants.js'

import { iamService } from '../../services/affinidi/iam/service.js'

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
    await iamService.deleteToken(tokenId)
    ux.action.stop('Deleted successfully!')

    if (!this.jsonEnabled()) this.logJson({ id: tokenId })
    return { id: tokenId }
  }
}
