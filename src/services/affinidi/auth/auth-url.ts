import { LoginAuthMethods } from '../../../common/constants.js'

export const applyAuthMethod = (authUrl: URL, authMethod?: LoginAuthMethods): URL => {
  if (!authMethod) return authUrl
  const url = new URL(authUrl)
  url.searchParams.set('auth_method', authMethod)
  return url
}
