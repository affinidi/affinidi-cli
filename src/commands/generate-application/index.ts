import { CliUx, Command, Flags } from '@oclif/core'
import path from 'path'

import { vaultService, GitService, Writer } from '../../services'
import { CliError, InvalidUseCase, NotSupportedPlatform, getErrorOutput } from '../../errors'
import { buildGeneratedAppNextStepsMessage } from '../../render/texts'

export enum Platforms {
  web = 'web',
  mobile = 'mobile',
}

export enum UseCasesAppNames {
  portableReputation = 'portable-reputation',
  accessWithoutOwnershipOfData = 'access-without-ownership-of-data',
  certificationAndVerification = 'certification-and-verification',
  kycKyb = 'kyc-kyb',
}

type PlatformType = `${Platforms}`
type UseCaseType = `${UseCasesAppNames}`

const UseCaseSources: Record<UseCaseType, string> = {
  'portable-reputation': 'NOT IMPLEMENTED YET',
  'access-without-ownership-of-data': 'NOT IMPLEMENTED YET',
  'certification-and-verification':
    'https://github.com/affinityproject/elements-reference-app-frontend.git',
  'kyc-kyb': 'NOT IMPLEMENTED YET',
}

export const defaultAppName = 'my-app'
export default class GenerateApplication extends Command {
  static command = 'affinidi generate-application'
  static usage = 'affinidi generate-application [FLAGS]'
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
      default: defaultAppName,
    }),
    'use-case': Flags.enum<UseCaseType>({
      char: 'u',
      description: 'Use case',
      default: 'certification-and-verification',
      options: Object.values(UseCasesAppNames),
    }),
  }

  public async run(): Promise<void> {
    const { flags } = await this.parse(GenerateApplication)
    const { name, platform, 'use-case': useCase } = flags

    if (platform === Platforms.mobile) {
      CliUx.ux.error(NotSupportedPlatform)
    }

    CliUx.ux.action.start('Generating an application')

    try {
      switch (useCase) {
        case UseCasesAppNames.certificationAndVerification:
          await this.download(UseCaseSources[useCase], name)
          break
        case UseCasesAppNames.accessWithoutOwnershipOfData:
        case UseCasesAppNames.portableReputation:
        case UseCasesAppNames.kycKyb:
          CliUx.ux.info('Not implemented yet')
          break
        default:
          CliUx.ux.error(InvalidUseCase)
      }
    } catch (error) {
      CliUx.ux.error(`Failed to generate an application: ${error.message}`)
    }

    this.setUpProject(name)

    CliUx.ux.action.stop('Application generated')

    const appPath = `${process.cwd()}/${name}`
    CliUx.ux.info(buildGeneratedAppNextStepsMessage(name, appPath))
  }

  async catch(error: CliError) {
    CliUx.ux.action.stop('failed')
    CliUx.ux.info(
      getErrorOutput(
        error,
        GenerateApplication.command,
        GenerateApplication.usage,
        GenerateApplication.description,
      ),
    )
  }

  private setUpProject(name: string) {
    const activeProject = vaultService.get('active-project-api-key')

    CliUx.ux.info(`Setting up the project`)

    try {
      Writer.write(path.join(name, '.env'), [
        'REACT_APP_CLOUD_WALLET_URL=https://cloud-wallet-api.prod.affinity-project.org',
        'REACT_APP_VERIFIER_URL=https://affinity-verifier.prod.affinity-project.org',
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
      throw Error(`Download Failed: ${error.message}`)
    }
  }
}
