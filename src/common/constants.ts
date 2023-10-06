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

export enum RefAppSamples {
  AFFINIDI_NEXTJS_NEXTAUTHJS = 'affinidi-nextjs-nextauthjs',
  AUTH0_NEXTJS_NEXTAUTHJS = 'auth0-nextjs-nextauthjs',
}
