import { CLIError } from '@oclif/core/errors'
import * as jose from 'jose'
import { SupportedAlgorithms, SupportedKeyTypes } from '../common/constants.js'

export async function pemToJWK(publicKeyPEM: string, algorithm: SupportedAlgorithms) {
  try {
    const publicKey = await jose.importSPKI(publicKeyPEM, algorithm)
    return await jose.exportJWK(publicKey)
  } catch (error) {
    throw new CLIError('Unable to decode the provided public key')
  }
}

export function getKeyType(algorithm: SupportedAlgorithms): SupportedKeyTypes {
  switch (algorithm) {
    case SupportedAlgorithms.ES256:
    case SupportedAlgorithms.ES512:
      return SupportedKeyTypes.EC
    case SupportedAlgorithms.RS256:
    case SupportedAlgorithms.RS512:
      return SupportedKeyTypes.RSA
  }
}

export async function JWKToPem(publicKey: jose.KeyLike): Promise<string> {
  try {
    return await jose.exportSPKI(publicKey)
  } catch (_) {
    throw new CLIError('Unable to convert the provided public key to pem format')
  }
}

export async function decryptSessionIdWithPrivateKey(message: string, privateKey: jose.KeyLike): Promise<string> {
  try {
    const { plaintext } = await jose.compactDecrypt(message, privateKey)
    const decoder = new TextDecoder()
    return decoder.decode(plaintext)
  } catch (_) {
    throw new CLIError('Unable to decrypt the message with the private-key')
  }
}
