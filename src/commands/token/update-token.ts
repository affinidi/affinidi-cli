import { readFile } from 'fs/promises'
import { ux, Flags } from '@oclif/core'
import { z } from 'zod'
import { BaseCommand, SupportedAlgorithms } from '../../common'
import { promptRequiredParameters } from '../../common/prompts'
import { INPUT_LIMIT } from '../../common/validators'
import { getKeyType, pemToJWK } from '../../helpers/jwk'
import { clientSDK } from '../../services/affinidi'
import { iamService } from '../../services/affinidi/iam'
import { MachineUserDto } from '../../services/affinidi/iam/iam.api'

export class UpdateToken extends BaseCommand<typeof UpdateToken> {
  static summary = 'Updates a Personal Access Token (PAT)'
  static examples = [
    '<%= config.bin %> <%= command.id %> -i <uuid> -n MyNewToken -k MyKeyID -f publicKey.pem',
    '<%= config.bin %> <%= command.id %> --token-id <uuid> --name "My new token" --key-id "My key ID" --public-key-file publicKey.pem --algorithm RS256',
  ]
  static flags = {
    'token-id': Flags.string({
      char: 'i',
      summary: 'ID of the Personal Access Token',
    }),
    name: Flags.string({
      char: 'n',
      summary: 'Name of the Personal Access Token, at least 8 chars long',
    }),
    'key-id': Flags.string({
      char: 'k',
      summary: 'Identifier of the key (kid)',
    }),
    'public-key-file': Flags.string({
      char: 'f',
      summary: 'Location of the public key PEM file',
    }),
    algorithm: Flags.custom<SupportedAlgorithms>({
      summary: 'The specific cryptographic algorithm used with the key',
      options: Object.values(SupportedAlgorithms),
      default: SupportedAlgorithms.RS256,
    })(),
  }

  public async run(): Promise<MachineUserDto> {
    const { flags } = await this.parse(UpdateToken)
    const promptFlags = await promptRequiredParameters(['token-id', 'name', 'key-id', 'public-key-file'], flags)

    const schema = z.object({
      'token-id': z.string().max(INPUT_LIMIT).uuid(),
      name: z.string().min(8).max(INPUT_LIMIT),
      algorithm: z.nativeEnum(SupportedAlgorithms),
      'key-id': z.string().max(INPUT_LIMIT),
      'public-key-file': z.string().max(INPUT_LIMIT),
    })
    const validatedFlags = schema.parse(promptFlags)

    ux.action.start('Updating Personal Access Token')

    const publicKeyPEM = await readFile(validatedFlags['public-key-file'], 'utf8')
    const jwk = await pemToJWK(publicKeyPEM, validatedFlags.algorithm)
    const out = await iamService.updateMachineUser(
      clientSDK.config.getUserToken()?.access_token,
      validatedFlags['token-id'],
      {
        name: validatedFlags.name,
        authenticationMethod: {
          type: 'PRIVATE_KEY',
          signingAlgorithm: validatedFlags.algorithm,
          publicKeyInfo: {
            jwks: {
              keys: [
                {
                  kid: validatedFlags['key-id'],
                  alg: validatedFlags.algorithm,
                  use: 'sig',
                  kty: jwk.kty ?? getKeyType(validatedFlags.algorithm),
                  n: jwk.n,
                  e: jwk.e,
                },
              ],
            },
          },
        },
      },
    )
    ux.action.stop('Updated successfully!')

    if (!this.jsonEnabled()) this.logJson(out)
    return out
  }
}
