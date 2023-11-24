import * as dotenv from 'dotenv'
import z from 'zod'
import { LogLevel } from './affinidi/logger/logger-adapter'

dotenv.config()

const envSchema = z.object({
  AFFINIDI_CLI_ENVIRONMENT: z.enum(['local', 'dev', 'prod']).default('prod'),
})

const common = {
  redirectHost: 'http://127.0.0.1',
  redirectPort: 64287,
  redirectPath: '/callback',
  redirectTimeoutMs: 5 * 60 * 1000,
  bffUxClient: 4,
  logLevel: 'info' as LogLevel,
}

const configs = {
  local: {
    ...common,
    bffHost: 'http://localhost:2777',
    bffCookieName: 'portal-session-local',
  },
  dev: {
    ...common,
    bffHost: 'https://dev.api.portal.affinidi.com',
    bffCookieName: 'portal-session-dev',
  },
  prod: {
    ...common,
    bffHost: 'https://api.portal.affinidi.com',
    bffCookieName: 'portal-session',
  },
}

export const env = envSchema.parse(process.env)
export const config = configs[env.AFFINIDI_CLI_ENVIRONMENT]
