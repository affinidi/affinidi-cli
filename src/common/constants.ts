export enum SupportedAlgorithms {
  RS256 = 'RS256',
  RS512 = 'RS512',
  ES256 = 'ES256',
  ES512 = 'ES512',
}

export enum SupportedKeyTypes {
  RSA = 'RSA',
  EC = 'EC',
}

export enum PrincipalTypes {
  TOKEN = 'token',
  USER = 'user',
}

export enum IdTokenClaimFormats {
  ARRAY = 'array',
  MAP = 'map',
}

export enum RefAppProvider {
  AFFINIDI = 'affinidi',
  AUTH0 = 'auth0',
}

export interface Auth0Config {
  callbackUrl: string
  webOriginUrl: string
  logOutUrl: string
}

export enum ServiceResourceIds {
  IAM_PROJECTS = 'iam.resource.Projects',
  VPA_CONFIGURATIONS = 'vpa.resource.Configurations',
}

export enum DidMethods {
  KEY = 'key',
  WEB = 'web',
  PEER0 = 'peer0',
  PEER2 = 'peer2',
}

export enum WalletAlgorithms {
  SECP256K1 = 'secp256k1',
  ED25519 = 'ed25519',
  P256 = 'p256',
}

export enum ServiceEndpointTypes {
  DID_COMM_MESSAGING = 'DIDCommMessaging',
  LINKED_DOMAINS = 'LinkedDomains',
  IDENTITY_HUB = 'IdentityHub',
  CREDENTIAL_REGISTRY = 'CredentialRegistry',
}
