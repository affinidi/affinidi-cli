import { CLIError } from '@oclif/core/lib/errors'
import { RefAppDjangoLibrary, RefAppFramework, RefAppNextJsLibrary } from '../common'

export function getAppName(framework: string, provider: string) {
  if (framework === RefAppFramework.DJANGO) {
    return `${provider}-${framework}-${RefAppDjangoLibrary.AUTHLIB}`
  } else if (framework === RefAppFramework.NEXTJS) {
    return `${provider}-${framework}-${RefAppNextJsLibrary.NEXTAUTHJS}`
  } else {
    throw new CLIError('Framework not configured!')
  }
}
