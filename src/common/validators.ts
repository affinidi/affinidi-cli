import { CLIError } from '@oclif/core/lib/errors'

export const INPUT_LIMIT = 2000
export const TOKEN_LIMIT = 5000
export const PRESENTATION_DEFINITION_LIMIT = 5000

export function validateInputLength(text: string, maxLength: number): string {
  if (text.length > maxLength) {
    throw new CLIError(`String must contain at most ${maxLength} character(s)`)
  }

  return text
}

export function split(text: string, splitChar: string): string[] {
  const arr: string[] = []
  const items = text.split(splitChar)

  for (const item of items) {
    if (item.length > 0) arr.push(item)
  }

  return arr
}
