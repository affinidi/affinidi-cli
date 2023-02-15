import { ux, Command, Flags } from '@oclif/core'
import { StatusCodes } from 'http-status-codes'
import { CliError, getErrorOutput, Unauthorized } from '../../errors'
import { isAuthenticated } from '../../middleware/authentication'
import { DisplayOptions, displayOutput } from '../../middleware/display'
import { configService } from '../../services'
import { checkErrorFromWizard } from '../../wizard/helpers'
import { generateApplication } from '../../exposedFunctions/genApp'
import { vaultService } from '../../services/vault/typedVaultService'
import { output } from '../../customFlags/outputFlag'

export enum Platforms {
  web = 'web',
  mobile = 'mobile',
}

export enum UseCasesAppNames {
  portableReputation = 'portable-reputation',
  // accessWithoutOwnershipOfData = 'access-without-ownership-of-data',
  healthReferenceApp = 'health',
  educationReferenceApp = 'education',
  ticketingReferenceApp = 'ticketing',
  // kycKyb = 'kyc-kyb',
}

export type UseCaseType = `${UseCasesAppNames}`

export const defaultAppName = 'my-app'
export default class GenerateApplication extends Command {
  static command = 'affinidi generate-application'

  static usage = 'generate-application [FLAGS]'

  static description = 'Use this command to generate a Privacy Preserving app'

  static examples = ['<%= config.bin %> <%= command.id %>']

  static flags = {
    platform: Flags.string({
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
    'use-case': Flags.string({
      char: 'u',
      description: 'Use case',
      default: UseCasesAppNames.ticketingReferenceApp,
      options: Object.values(UseCasesAppNames),
    }),
    output,
  }

  public async run(): Promise<void> {
    const { flags } = await this.parse(GenerateApplication)
    const { name, platform, 'use-case': useCase } = flags
    if (!isAuthenticated()) {
      throw new CliError(Unauthorized, StatusCodes.UNAUTHORIZED, 'generator')
    }
    const {
      apiKey: { apiKeyHash },
      wallet: { did },
      project: { projectId },
    } = vaultService.getActiveProject()
    const timeStamp = vaultService.getTimeStamp()

    await generateApplication(
      {
        platform,
        name,
        output: flags.output,
        use_case: useCase,
        apiKey: apiKeyHash,
        projectDid: did,
        projectId,
      },
      timeStamp,
    )
  }

  async catch(error: CliError) {
    if (checkErrorFromWizard(error)) throw error
    ux.action.stop('failed')
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
