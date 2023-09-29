import { input } from '@inquirer/prompts'
import { CLIError } from '@oclif/core/lib/errors'
import { giveFlagInputErrorMessage } from './generate-error-message'

export async function promptRequiredParameters(
  requiredFlags: string[],
  inputFlags: Record<string, any>,
): Promise<Record<string, any>> {
  for (const key in Object.keys(requiredFlags)) {
    if (!inputFlags[requiredFlags[key]]) {
      if (inputFlags['no-input']) {
        throw new CLIError(giveFlagInputErrorMessage(requiredFlags[key]))
      }
      inputFlags[requiredFlags[key]] = await input({ message: `Enter the value for ${requiredFlags[key]}` })
    }
  }

  return inputFlags
}
