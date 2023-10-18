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
  TOKEN = 'machine_user',
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

export enum RefAppFramework {
  DJANGO = 'django',
  NEXTJS = 'nextjs',
}

export enum RefAppDjangoLibrary {
  AUTHLIB = 'authlib',
}

export enum RefAppNextJsLibrary {
  NEXTAUTHJS = 'nextauthjs',
}

export interface Auth0Config {
  callbackUrl: string
  webOriginUrl: string
  logOutUrl: string
}
