import { Flags } from '@oclif/core'

export const output = Flags.string({
  char: 'o',
  description: 'set flag to override default output format view',
  options: ['json', 'plaintext'],
})
