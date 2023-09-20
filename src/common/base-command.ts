import { Command, Flags, Interfaces } from '@oclif/core'
import { CLIError } from '@oclif/core/lib/errors'
import chalk from 'chalk'
import { ZodError } from 'zod'
import { fromZodError } from 'zod-validation-error'

enum LogLevel {
  debug = 'debug',
  info = 'info',
  warn = 'warn',
  error = 'error',
}

export type FlagsType<T extends typeof Command> = Interfaces.InferredFlags<
  (typeof BaseCommand)['baseFlags'] & T['flags']
>
export type ArgsType<T extends typeof Command> = Interfaces.InferredArgs<T['args']>

export abstract class BaseCommand<T extends typeof Command> extends Command {
  // add the --json flag
  static enableJsonFlag = true

  // define flags that can be inherited by any command that extends BaseCommand
  static baseFlags = {
    'log-level': Flags.custom<LogLevel>({
      summary: 'Specify level for logging.',
      options: Object.values(LogLevel),
      helpGroup: 'GLOBAL',
    })(),
    'no-color': Flags.boolean({
      summary: 'Disables color in the output. If you have trouble distinguishing colors, consider using this flag.',
      helpGroup: 'GLOBAL',
    }),
  }

  protected flags!: FlagsType<T>

  protected args!: ArgsType<T>

  protected chalk = chalk

  public async init(): Promise<void> {
    await super.init()

    const { args, flags } = await this.parse({
      flags: this.ctor.flags,
      // eslint-disable-next-line  @typescript-eslint/consistent-type-assertions
      baseFlags: (super.ctor as typeof BaseCommand).baseFlags,
      args: this.ctor.args,
      strict: this.ctor.strict,
    })
    // eslint-disable-next-line  @typescript-eslint/consistent-type-assertions
    this.flags = flags as FlagsType<T>
    // eslint-disable-next-line  @typescript-eslint/consistent-type-assertions
    this.args = args as ArgsType<T>
  }

  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  protected async catch(err: Error & { exitCode?: number }): Promise<any> {
    if (err instanceof ZodError) {
      let message = 'Invalid input parameters\n'
      message +=
        'Please, check the validity of entered values. Use flag --help to get details about input parameters.\n\n'
      const validationError = fromZodError(err, {
        issueSeparator: '\n- ',
        prefix: 'Validation errors found',
        prefixSeparator: ':\n- ',
      })
      message += validationError
      return super.catch(new CLIError(message))
    }
    return super.catch(err)
  }

  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  protected async finally(_: Error | undefined): Promise<any> {
    // called after run and catch regardless of whether or not the command errored
    return super.finally(_)
  }
}
