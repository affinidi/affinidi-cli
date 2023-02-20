import { Flags } from '@oclif/core'
import { ViewFormat } from '../constants'

export const output = Flags.enum<ViewFormat>({
  char: 'o',
  description: 'set flag to override default output format view',
  options: ['json', 'plaintext'],
})
