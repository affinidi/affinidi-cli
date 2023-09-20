import { Flags } from '@oclif/core'
import { BaseCommand } from '../../common'
import { configService } from '../../services'
import { clientSDK } from '../../services/affinidi'

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

    const { principalId } = await clientSDK.login({
      projectId: flags['project-id'],
    })

    configService.createOrUpdate(principalId)
  }
}
