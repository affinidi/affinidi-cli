import { LoggerAdapter, LogLevel } from './logger-adapter'

export class ConsoleLoggerAdapter implements LoggerAdapter {
  private readonly logLevel: LogLevel

  constructor(logLevel: LogLevel) {
    this.logLevel = logLevel
  }
  log(level: LogLevel, message: string): void {
    switch (level) {
      case 'trace':
        return this.trace(message)
      case 'debug':
        return this.debug(message)
      case 'info':
        return this.info(message)
      case 'warn':
        return this.warn(message)
      case 'error':
        return this.error(message)
      case 'fatal':
        return this.fatal(message)
    }
  }
  trace(message: string): void {
    if (['trace'].includes(this.logLevel)) {
      console.log(message)
    }
  }

  debug(message: string): void {
    if (['trace', 'debug'].includes(this.logLevel)) {
      console.log(message)
    }
  }

  info(message: string): void {
    if (['trace', 'debug', 'info'].includes(this.logLevel)) {
      console.log(message)
    }
  }

  warn(message: string): void {
    if (['trace', 'debug', 'info', 'warn'].includes(this.logLevel)) {
      console.log(message)
    }
  }

  error(message: string): void {
    if (['trace', 'debug', 'info', 'warn', 'error'].includes(this.logLevel)) {
      console.log(message)
    }
  }

  fatal(message: string): void {
    if (['trace', 'debug', 'info', 'warn', 'error', 'fatal'].includes(this.logLevel)) {
      console.log(message)
    }
  }
}
