import { CliUx, Command, Flags } from '@oclif/core'
import { StatusCodes } from 'http-status-codes'
import { CliError, getErrorOutput, Unauthorized } from '../../errors'
import { isAuthenticated } from '../../middleware/authentication'
import { DisplayOptions, displayOutput } from '../../middleware/display'
import { ViewFormat } from '../../constants'
import { configService } from '../../services/config'
import { checkErrorFromWizard } from '../../wizard/helpers'
import { generateApplication } from '../../exposedFunctions/genApp'
import { vaultService } from '../../services/vault/typedVaultService'

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

export const defaultAppName = 'my-app'
export class GenerateApplication extends Command {
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
    const {
      apiKey: { apiKeyHash },
      wallet: { did },
      project: { projectId },
    } = vaultService.getActiveProject()

    await generateApplication({
      platform,
      name,
      output: flags.output,
      use_case: useCase,
      withProxy,
      apiKey: apiKeyHash,
      projectDid: did,
      projectId,
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
}
