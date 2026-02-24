import { CLIError } from '@oclif/core/errors'
import z from 'zod'
import { INPUT_LIMIT } from './constants.js'

export function validateInputLength(text: string, maxLength: number): string {
  if (text.length > maxLength) {
    throw new CLIError(`String must contain at most ${maxLength} character(s)`)
  }

  return text
}

export function split(text: string, delimiter: string): string[] {
  return text.split(delimiter).filter((item) => item.length > 0)
}

export const policiesDataSchema = z.object({
  version: z.string().max(INPUT_LIMIT),
  statement: z
    .object({
      principal: z.string().max(INPUT_LIMIT).array().length(1),
      action: z.string().max(INPUT_LIMIT).array().nonempty(),
      resource: z.string().max(INPUT_LIMIT).array().nonempty(),
      effect: z.literal('Allow'),
    })
    .array()
    .nonempty(),
})
