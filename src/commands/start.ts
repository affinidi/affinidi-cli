import { Flags, ux } from '@oclif/core'
import z from 'zod'
import { BaseCommand } from '../common'
import { INPUT_LIMIT } from '../common/validators'
import { configService } from '../services'
import { clientSDK } from '../services/affinidi'
import { bffClient } from '../services/affinidi/bff-client'

export class Start extends BaseCommand<typeof Start> {
  static summary = 'Log in to Affinidi'
  static examples = [
    '<%= config.bin %> <%= command.id %>',
    '<%= config.bin %> <%= command.id %> -i <project-id>',
    '<%= config.bin %> <%= command.id %> --project-id <project-id>',
  ]
  static flags = {
    'project-id': Flags.string({
      char: 'i',
      summary: 'ID of the project to set as active',
    }),
  }

  public async run(): Promise<void> {
    // const { flags } = await this.parse(Start)
    // const schema = z.string().uuid().max(INPUT_LIMIT).optional()
    // const projectId = schema.parse(flags['project-id'])

    ux.action.start('Authenticating in browser')
    try {
      await bffClient.login()
      ux.action.start('Authenticated successfully!')
    } catch (error) {
      ux.action.stop('Authentication failed!')
      this.error(error as string)
    }
  }
}
