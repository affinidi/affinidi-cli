export type LogLevel = 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal'

export interface LoggerAdapter {
  log(level: LogLevel, message: string): void
  trace(message: string): void
  debug(message: string): void
  info(message: string): void
  warn(message: string): void
  error(message: string): void
  fatal(message: string): void
}
