import { Flags } from '@oclif/core'
import { BaseCommand } from '../common'
import { configService } from '../services'
import { clientSDK } from '../services/affinidi'
import z from 'zod'

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
    const { flags } = await this.parse(Start)
    const schema = z.string().uuid().optional()
    const projectId = schema.parse(flags['project-id'])

    const { principalId } = await clientSDK.login({
      projectId,
    })

    configService.createOrUpdate(principalId)
  }
}
