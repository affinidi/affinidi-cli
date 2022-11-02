import { CliUx, Command, Flags } from '@oclif/core'

import { vaultService } from '../../services'
import { GitService } from '../../services/git'
import { Writer } from './writer'

type PlatformType = 'web' | 'mobile'
type UseCaseType =
  | 'portable-reputation'
  | 'access-without-ownership-of-data'
  | 'certification-and-verification'
  | 'kyc-kyb'

const UseCaseSources: Record<UseCaseType, string> = {
  'portable-reputation': 'NOT IMPLEMENTED YET',
  'access-without-ownership-of-data': 'NOT IMPLEMENTED YET',
  'certification-and-verification':
    'git@gitlab.com:affinidi/foundational/phoenix/holder-reference-app.git',
  'kyc-kyb': 'NOT IMPLEMENTED YET',
}

export default class GenerateApplication extends Command {
  static description = 'Use this command to generate a Privacy Preserving app'

  static examples = ['<%= config.bin %> <%= command.id %>']

  static flags = {
    platform: Flags.enum<PlatformType>({
      char: 'p',
      description: 'Platform',
      default: 'web',
      options: ['web', 'mobile'],
    }),
    name: Flags.string({
      char: 'n',
      description: 'Name of the application',
      default: 'my-app',
    }),
    'use-case': Flags.enum<UseCaseType>({
      char: 'u',
      description: 'Use case',
      default: 'certification-and-verification',
      options: [
        'portable-reputation',
        'access-without-ownership-of-data',
        'certification-and-verification',
        'kyc-kyb',
      ],
    }),
  }

  public async run(): Promise<void> {
    const { flags } = await this.parse(GenerateApplication)

    CliUx.ux.action.start('Generating an application')

    const useCase = flags['use-case']
    const name = flags.name

    try {
      switch (useCase) {
        case 'certification-and-verification':
          await this.download(UseCaseSources[useCase], name)
          break
        case 'access-without-ownership-of-data':
        case 'portable-reputation':
        case 'kyc-kyb':
          CliUx.ux.info('Not implemented yet')
          return
        default:
          CliUx.ux.error('Invalid use-case')
          break
      }
    } catch (error) {
      CliUx.ux.info(`Failed to generate an application: ${error.message}`)
      return
    }

    this.setUpProject(name)

    CliUx.ux.action.stop()
  }

  private setUpProject(name: string) {
    const activeProject = vaultService.get('active-project-api-key')

    CliUx.ux.info(`Setting up the project`)

    try {
      Writer.write(`${name}/.env`, [
        'REACT_APP_CLOUD_WALLET_URL=https://cloud-wallet-api.prod.affinity-project.org',
        `REACT_APP_API_KEY=${activeProject}`,
      ])
    } catch (error) {
      CliUx.ux.info(`Failed to set up project: ${error.message}`)
    }
  }

  private async download(gitUrl: string, destination: string): Promise<void> {
    try {
      await GitService.clone(gitUrl, destination)
    } catch (error) {
      CliUx.ux.info(`Download Failed: ${error.message}`)
        }
  }
}
