import process from 'process'

export const VP_ADAPTER_URL =
  process.env.AFFINIDI_CLI_ENVIRONMENT === 'dev' || process.env.AFFINIDI_CLI_ENVIRONMENT === 'test'
    ? 'https://apse1.dev.api.affinidi.io/vpa'
    : 'https://apse1.api.affinidi.io/vpa'

export const IAM_URL =
  process.env.AFFINIDI_CLI_ENVIRONMENT === 'dev' || process.env.AFFINIDI_CLI_ENVIRONMENT === 'test'
    ? 'https://apse1.dev.api.affinidi.io/iam'
    : 'https://apse1.api.affinidi.io/iam'

export const AUTH_URL =
  process.env.AFFINIDI_CLI_ENVIRONMENT === 'dev' || process.env.AFFINIDI_CLI_ENVIRONMENT === 'test'
    ? 'https://nervous-greider-775ugzehsx.projects.oryapis.com'
    : 'https://euw1.vpa.auth.affinidi.io'
