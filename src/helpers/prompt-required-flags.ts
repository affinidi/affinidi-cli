import { input } from '@inquirer/prompts'

export async function promptRequiredParameters(
  requiredFlags: string[],
  inputFlags: Record<string, any>,
): Promise<Record<string, any>> {
  for (const key in Object.keys(requiredFlags)) {
    if (!inputFlags[requiredFlags[key]]) {
      inputFlags[requiredFlags[key]] = await input({ message: `Enter the value for ${requiredFlags[key]}` })
    }
  }

  return inputFlags
}
