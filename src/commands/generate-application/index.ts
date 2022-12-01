import { CliUx, Command, Flags } from '@oclif/core'
import { StatusCodes } from 'http-status-codes'
import path from 'path'

import { vaultService, GitService, Writer, VAULT_KEYS } from '../../services'
import {
  CliError,
  InvalidUseCase,
  NotSupportedPlatform,
  getErrorOutput,
  Unauthorized,
} from '../../errors'
import { buildGeneratedAppNextStepsMessage } from '../../render/texts'
import { getSession } from '../../services/user-management'
import { EventDTO } from '../../services/analytics/analytics.api'
import { analyticsService, generateUserMetadata } from '../../services/analytics'
import { isAuthenticated } from '../../middleware/authentication'
import { displayOutput } from '../../middleware/display'

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
    'https://github.com/affinidi/elements-reference-app-frontend.git',
  'kyc-kyb': 'NOT IMPLEMENTED YET',
}

export const defaultAppName = 'my-app'
export default class GenerateApplication extends Command {
  static command = 'affinidi generate-application'

  static usage = 'generate-application [FLAGS]'

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
    'with-proxy': Flags.boolean({
      char: 'w',
      description: 'Add BE-proxy to protect credentials',
      default: false,
    }),
  }

  public async run(): Promise<void> {
    const { flags } = await this.parse(GenerateApplication)
    const { name, platform, 'use-case': useCase, 'with-proxy': withProxy } = flags
    if (!isAuthenticated()) {
      throw new CliError(Unauthorized, StatusCodes.UNAUTHORIZED, 'generator')
    }
    const userId = getSession()?.account?.id
    const analyticsData: EventDTO = {
      name: 'APPLICATION_GENERATION_STARTED',
      category: 'APPLICATION',
      component: 'Cli',
      uuid: userId,
      metadata: {
        appName: name,
        commandId: 'affinidi.generate-application',
        ...generateUserMetadata(userId),
      },
    }

    if (platform === Platforms.mobile) {
      throw new CliError(NotSupportedPlatform, 0, 'reference-app')
    }

    CliUx.ux.action.start('Generating an application')

    try {
      switch (useCase) {
        case UseCasesAppNames.certificationAndVerification:
          await this.download(UseCaseSources[useCase], name)
          await analyticsService.eventsControllerSend(analyticsData)
          break
        case UseCasesAppNames.accessWithoutOwnershipOfData:
        case UseCasesAppNames.portableReputation:
        case UseCasesAppNames.kycKyb:
          displayOutput('Not implemented yet')
          break
        default:
          throw new CliError(InvalidUseCase, 0, 'reference-app')
      }
    } catch (error) {
      throw new CliError(`Failed to generate an application: ${error.message}`, 0, 'reference-app')
    }

    try {
      if (withProxy) {
        await this.download(
          'https://github.com/affinidi/elements-reference-app-backend.git',
          `${name}-backend`,
        )
      }
    } catch (error) {
      displayOutput(`Failed to generate an application: ${error.message}`)
      return
    }

    this.setUpProject(name, withProxy)
    analyticsData.name = 'APPLICATION_GENERATION_COMPLETED'
    await analyticsService.eventsControllerSend(analyticsData)
    CliUx.ux.action.stop('\nApplication generated')

    const appPath = path.resolve(`${process.cwd()}/${name}`)
    displayOutput(buildGeneratedAppNextStepsMessage(name, appPath, withProxy))
  }

  async catch(error: CliError) {
    CliUx.ux.action.stop('failed')
    CliUx.ux.info(
      getErrorOutput(
        error,
        GenerateApplication.command,
        GenerateApplication.usage,
        GenerateApplication.description,
        false,
      ),
    )
  }

  private setUpProject(name: string, withProxy: boolean) {
    const activeProjectApiKey = vaultService.get(VAULT_KEYS.projectAPIKey)
    const activeProjectDid = vaultService.get(VAULT_KEYS.projectDID)
    const activeProjectId = vaultService.get(VAULT_KEYS.projectId)
    if (!activeProjectApiKey || !activeProjectDid || !activeProjectId) {
      throw Error(Unauthorized)
    }

    displayOutput(`Setting up the project`)

    try {
      if (withProxy) {
        Writer.write(path.join(name, '.env'), [
          'REACT_APP_CLOUD_WALLET_URL=http://localhost:8080/cloud-wallet',
          'REACT_APP_VERIFIER_URL=http://localhost:8080/affinity-verifier',
          'REACT_APP_USER_MANAGEMENT_URL=http://localhost:8080/user-management',
          'REACT_APP_ISSUANCE_URL=http://localhost:8080/console-vc-issuance',
        ])

        Writer.write(path.join(`${name}-backend`, '.env'), [
          'HOST=127.0.0.1',
          'PORT=8080',
          'NODE_ENV=dev',
          'ENVIRONMENT=development',
          'FRONTEND_HOST=http://localhost:3000',

          `API_KEY_HASH=${activeProjectApiKey}`,
          `ISSUER_DID=${activeProjectDid}`,
          `PROJECT_ID=${activeProjectId}`,
        ])

        return
      }

      Writer.write(path.join(name, '.env'), [
        'REACT_APP_CLOUD_WALLET_URL=https://cloud-wallet-api.prod.affinity-project.org',
        'REACT_APP_VERIFIER_URL=https://affinity-verifier.prod.affinity-project.org',
        'REACT_APP_USER_MANAGEMENT_URL=https://console-user-management.apse1.affinidi.com',
        'REACT_APP_ISSUANCE_URL=https://console-vc-issuance.apse1.affinidi.com',
        'REACT_APP_IAM_URL=https://affinidi-iam.apse1.affinidi.com',

        `REACT_APP_API_KEY=${activeProjectApiKey}`,
        `REACT_APP_PROJECT_DID=${activeProjectDid}`,
        `REACT_APP_PROJECT_ID=${activeProjectId}`,
      ])
    } catch (error) {
      displayOutput(`Failed to set up project: ${error.message}`)
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
