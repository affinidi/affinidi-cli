import { LoggerAdapter, LogLevel } from './adapters'

export type Environment = 'dev' | 'prod'

export type ClientSDKConfig = {
  logger?: LoggerAdapter // default = ConsoleLoggerAdapter
  logLevel?: LogLevel // default = info

  environment?: Environment

  authConfig: {
    clientId: string
    host: string
  }

  component: 'Cli' | 'VsCodeExtension'
}
