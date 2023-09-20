import { ux, Flags } from '@oclif/core'
import { z } from 'zod'
import { BaseCommand } from '../../common'
import { clientSDK } from '../../services/affinidi'
import { iamService } from '../../services/affinidi/iam'
import { MachineUserDto } from '../../services/affinidi/iam/iam.api'

export class GetToken extends BaseCommand<typeof GetToken> {
  static summary = 'Gets the details of a token'
  static examples = [
    '<%= config.bin %> <%= command.id %> -i <uuid>',
    '<%= config.bin %> <%= command.id %> --token-id <uuid>',
  ]
  static flags = {
    'token-id': Flags.string({
      char: 'i',
      summary: 'ID of the token',
      required: true,
    }),
  }

  public async run(): Promise<MachineUserDto> {
    const { flags } = await this.parse(GetToken)

    const schema = z.string().uuid()
    const tokenId = schema.parse(flags['token-id'])

    ux.action.start('Fetching token details')
    const out = await iamService.getMachineUser(clientSDK.config.getUserToken()?.access_token, tokenId)
    ux.action.stop('Fetched successfully!')

    if (!this.jsonEnabled()) this.logJson(out)
    return out
  }
}
