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

// Must match the BFF's SUPPORTED_PROVIDER_HINTS, which rejects any other value.
export enum LoginProviders {
  AFFINIDI = 'affinidi',
  GOOGLE = 'google',
  MICROSOFT = 'microsoft',
  APPLE = 'apple',
  GITHUB = 'github',
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
}
