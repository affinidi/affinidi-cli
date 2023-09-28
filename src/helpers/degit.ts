import { CLIError } from '@oclif/core/lib/errors'
import chalk from 'chalk'
import degit from 'degit'

export async function cloneWithDegit(source: string, destination: string, force: boolean) {
  const emitter = degit(source, {
    cache: false,
    force,
    verbose: false,
  })

  try {
    await emitter.clone(destination)
  } catch (error) {
    let message = (error as Error).message
    message = message.replace(
      'destination directory is not empty, aborting. Use options.force to override',
      'Destination directory is not empty. Use flag --force to override',
    )
    message = message.replace(
      'could not find commit hash for HEAD',
      `Reference application source code not found. Make sure you have git installed and added to your PATH.',
      )}`,
    )
    throw new CLIError(`Unable to generate reference application\n${chalk.red(message)}`)
  }
}
