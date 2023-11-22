import { ux, Flags } from '@oclif/core'
import { z } from 'zod'
import { BaseCommand } from '../../common'
import { promptRequiredParameters } from '../../common/prompts'
import { INPUT_LIMIT } from '../../common/validators'
import { iamService } from '../../services/affinidi/iam'
import { TokenDto } from '../../services/affinidi/iam/iam.api'

export class GetToken extends BaseCommand<typeof GetToken> {
  static summary = 'Gets the details of a Personal Access Token (PAT)'
  static examples = [
    '<%= config.bin %> <%= command.id %> -i <uuid>',
    '<%= config.bin %> <%= command.id %> --token-id <uuid>',
  ]
  static flags = {
    'token-id': Flags.string({
      char: 'i',
      summary: 'ID of the Personal Access Token',
    }),
  }

  public async run(): Promise<TokenDto> {
    const { flags } = await this.parse(GetToken)
    const promptFlags = await promptRequiredParameters(['token-id'], flags)

    const schema = z.string().max(INPUT_LIMIT).uuid()
    const tokenId = schema.parse(promptFlags['token-id'])

    ux.action.start('Fetching Personal Access Token details')
    const out = await iamService.getToken(tokenId)
    ux.action.stop('Fetched successfully!')

    if (!this.jsonEnabled()) this.logJson(out)
    return out
  }
}
