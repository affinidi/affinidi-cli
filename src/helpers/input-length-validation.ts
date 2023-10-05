import { CLIError } from '@oclif/core/lib/errors'

export const INPUT_LIMIT = 2000

export function validateInputLength(text: string, maxlength: number): string {
  if (text.length > maxlength) {
    throw new CLIError(`String must contain at most ${maxlength} character(s)`)
  }

  return text
}
