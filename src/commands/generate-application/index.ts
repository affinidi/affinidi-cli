import { CliUx, Command, Flags } from '@oclif/core'
import { StatusCodes } from 'http-status-codes'
import path from 'path'
import { vaultService } from '../../services/vault/typedVaultService'
import { GitService, Writer } from '../../services'
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
import { DisplayOptions, displayOutput } from '../../middleware/display'
import { ViewFormat } from '../../constants'
import { configService } from '../../services/config'
import { checkErrorFromWizard } from '../../wizard/helpers'

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
      hidden: true,
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
      hidden: true,
    }),
    'with-proxy': Flags.boolean({
      char: 'w',
      description: 'Add BE-proxy to protect credentials',
      default: false,
    }),
    output: Flags.enum<ViewFormat>({
      char: 'o',
      description: 'set flag to override default output format view',
      options: ['plaintext', 'json'],
    }),
  }

  public async run(): Promise<void> {
    const { flags } = await this.parse(GenerateApplication)
    const { name, platform, 'use-case': useCase, 'with-proxy': withProxy } = flags
    if (!isAuthenticated()) {
      throw new CliError(Unauthorized, StatusCodes.UNAUTHORIZED, 'generator')
    }
    const userId = getSession()?.account?.userId
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
          displayOutput({ itemToDisplay: 'Not implemented yet', flag: flags.output })
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
      displayOutput({
        itemToDisplay: `Failed to generate an application: ${error.message}`,
        flag: flags.output,
        err: true,
      })
      return
    }

    await this.setUpProject(name, withProxy)
    analyticsData.name = 'APPLICATION_GENERATION_COMPLETED'
    await analyticsService.eventsControllerSend(analyticsData)
    CliUx.ux.action.stop('\nApplication generated')

    const appPath = path.resolve(`${process.cwd()}/${name}`)
    displayOutput({
      itemToDisplay: buildGeneratedAppNextStepsMessage(name, appPath, withProxy),
      flag: flags.output,
    })
  }

  async catch(error: CliError) {
    if (checkErrorFromWizard(error)) throw error
    CliUx.ux.action.stop('failed')
    const outputFormat = configService.getOutputFormat()
    const optionsDisplay: DisplayOptions = {
      itemToDisplay: getErrorOutput(
        error,
        GenerateApplication.command,
        GenerateApplication.usage,
        GenerateApplication.description,
        outputFormat !== 'plaintext',
      ),
      err: true,
    }
    try {
      const { flags } = await this.parse(GenerateApplication)
      optionsDisplay.flag = flags.output
      displayOutput(optionsDisplay)
    } catch (_) {
      displayOutput(optionsDisplay)
    }
  }

  private async setUpProject(name: string, withProxy: boolean) {
    const activeProject = vaultService.getActiveProject()
    const activeProjectApiKey = activeProject.apiKey.apiKeyHash
    const activeProjectDid = activeProject.wallet.did
    const activeProjectId = activeProject.project.projectId
    const { flags } = await this.parse(GenerateApplication)

    if (!activeProjectApiKey || !activeProjectDid || !activeProjectId) {
      throw Error(Unauthorized)
    }

    displayOutput({ itemToDisplay: `Setting up the project`, flag: flags.output })

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
      displayOutput({
        itemToDisplay: `Failed to set up project: ${error.message}`,
        flag: flags.output,
        err: true,
      })
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
