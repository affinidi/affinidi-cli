import { KeyExportOptions } from 'crypto'
import { generateKeyPairSync } from 'node:crypto'
import { JsonWebKeySetDto } from '@affinidi-tdk/iam-client'
import { SupportedAlgorithms } from '../common/constants.js'
import { policiesDataSchema } from '../common/validators.js'
import { iamService } from '../services/affinidi/iam/service.js'

export function generateDefaultTokenName(): string {
  const user = process.env.USER ?? 'cli'
  const hostname = process.env.HOSTNAME ?? 'cli'
  return `PAT-${user}@${hostname}`
}

export function generateKeyPair(keyId: string, algorithm: string, passphrase?: string) {
  const { publicKey, privateKey } = generateKeyPairSync('rsa', { modulusLength: 4096 })

  const publicKeyPem = publicKey.export({ format: 'pem', type: 'spki' })
  const exportOptions: KeyExportOptions<'pem'> = {
    format: 'pem',
    type: 'pkcs8',
  }
  if (passphrase) {
    exportOptions.cipher = 'aes-256-cbc'
    exportOptions.passphrase = passphrase
  }
  const privateKeyPem = privateKey.export(exportOptions)
  const publicKeyJwk = publicKey.export({ format: 'jwk' })

  const jwks = {
    keys: [
      {
        use: 'sig',
        kid: keyId,
        alg: algorithm,
        ...publicKeyJwk,
      },
    ],
  }

  return { publicKey: publicKeyPem, privateKey: privateKeyPem, jwks }
}

export async function createToken(
  name: string,
  algorithm: SupportedAlgorithms,
  jwks: JsonWebKeySetDto,
  keyId?: string,
) {
  let token = await iamService.createToken({
    name,
    authenticationMethod: {
      type: 'PRIVATE_KEY',
      signingAlgorithm: algorithm,
      publicKeyInfo: {
        jwks,
      },
    },
  })
  // If keyId was not provided it means that a randomly generated uuid was assigned and we should change it to the tokenId
  if (!keyId) {
    jwks.keys[0].kid = token.id
    token = await iamService.updateToken(token.id, {
      name,
      authenticationMethod: {
        type: 'PRIVATE_KEY',
        signingAlgorithm: algorithm,
        publicKeyInfo: {
          jwks,
        },
      },
    })
  }
  return token
}

export async function addPrincipal(tokenId: string) {
  await iamService.addPrincipalToProject({
    principalId: tokenId,
    principalType: 'token',
  })
}

export async function updatePolicies(tokenId: string, activeProjectId: string, actions: string[], resources: string[]) {
  const policiesData = {
    version: '2022-12-15',
    statement: [
      {
        principal: [`ari:iam::${activeProjectId}:token/${tokenId}`],
        action: actions,
        resource: resources,
        effect: 'Allow',
      },
    ],
  }
  const validatedPolicies = policiesDataSchema.parse(policiesData)
  const result = await iamService.updatePolicies(tokenId, 'token', validatedPolicies)
  return result
}
