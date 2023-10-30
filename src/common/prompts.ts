import { input } from '@inquirer/prompts'
import { CLIError } from '@oclif/core/lib/errors'
import { giveFlagInputErrorMessage } from './error-messages'
import { INPUT_LIMIT, validateInputLength } from './validators'

export async function promptRequiredParameters(
  requiredFlags: string[],
  inputFlags: Record<string, any>,
): Promise<Record<string, any>> {
  for (const key in Object.keys(requiredFlags)) {
    if (!inputFlags[requiredFlags[key]]) {
      if (inputFlags['no-input']) {
        throw new CLIError(giveFlagInputErrorMessage(requiredFlags[key]))
      }
      const validatedInput = validateInputLength(
        await input({ message: `Enter the value for ${requiredFlags[key]}` }),
        INPUT_LIMIT,
      )
      inputFlags[requiredFlags[key]] = validatedInput
    }
  }

  return inputFlags
}
