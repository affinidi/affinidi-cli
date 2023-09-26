import { readFile } from 'fs/promises'
import { Flags, ux } from '@oclif/core'
import { z } from 'zod'
import { BaseCommand, SupportedAlgorithms } from '../../common'
import { getKeyType, promptRequiredParameters } from '../../helpers'
import { pemToJWK } from '../../helpers/jwk'
import { clientSDK } from '../../services/affinidi'
import { iamService } from '../../services/affinidi/iam'
import { MachineUserDto } from '../../services/affinidi/iam/iam.api'

export class CreateToken extends BaseCommand<typeof CreateToken> {
  static summary = 'Creates a Personal Access Token (PAT)'
  static examples = [
    '<%= config.bin %> <%= command.id %> -n MyNewToken -k MyKeyID -f publicKey.pem',
    '<%= config.bin %> <%= command.id %> --name "My new token" --key-id MyKeyID --public-key-file publicKey.pem --algorithm RS256',
  ]
  static flags = {
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
    const { flags } = await this.parse(CreateToken)
    const promptFlags = await promptRequiredParameters(['name', 'key-id', 'public-key-file'], flags)

    const schema = z.object({
      name: z.string().min(8),
      algorithm: z.nativeEnum(SupportedAlgorithms),
      'key-id': z.string(),
      'public-key-file': z.string(),
    })
    const validatedFlags = schema.parse(promptFlags)

    ux.action.start('Creating Personal Access Token')

    const publicKeyPEM = await readFile(validatedFlags['public-key-file'], 'utf8')
    const jwk = await pemToJWK(publicKeyPEM, validatedFlags.algorithm)
    const out = await iamService.createMachineUser(clientSDK.config.getUserToken()?.access_token, {
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
    })
    ux.action.stop('Created successfully!')

    if (!this.jsonEnabled()) this.logJson(out)
    return out
  }
}
