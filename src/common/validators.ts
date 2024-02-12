import { CLIError } from '@oclif/core/lib/errors'

export const INPUT_LIMIT = 2000
export const TOKEN_LIMIT = 5000
export const MAX_ITEMS_LIMIT = 20
export const PRESENTATION_DEFINITION_LIMIT = 5000

export function validateInputLength(text: string, maxLength: number): string {
  if (text.length > maxLength) {
    throw new CLIError(`String must contain at most ${maxLength} character(s)`)
  }

  return text
}

export function split(text: string, delimiter: string): string[] {
  return text.split(delimiter).filter((item) => item.length > 0)
}
