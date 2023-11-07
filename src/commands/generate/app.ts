import password from '@inquirer/password'
import { confirm, input, select } from '@inquirer/prompts'
import { ux, Flags } from '@oclif/core'
import { CLIError } from '@oclif/core/lib/errors'
import z from 'zod'
import { BaseCommand, RefAppProvider } from '../../common'
import { promptRequiredParameters } from '../../helpers'
import { getAppName, getApps, getSupportedAppsInformation } from '../../helpers/app'
import { cloneWithDegit } from '../../helpers/degit'
import { giveFlagInputErrorMessage } from '../../helpers/generate-error-message'
import { INPUT_LIMIT, TOKEN_LIMIT, validateInputLength } from '../../helpers/input-length-validation'
import { clientSDK } from '../../services/affinidi'
import { vpAdapterService } from '../../services/affinidi/vp-adapter'
import { createAuth0Resources } from '../../services/generator/auth0'
import { configureAppEnvironment } from '../../services/generator/env-configurer'

const APPS_INFORMATION_GITHUB_LOCATION = 'samples/apps.json'
const APPS_GITHUB_LOCATION = 'affinidi/reference-app-affinidi-vault/samples'

export default class GenerateApp extends BaseCommand<typeof GenerateApp> {
  static apps: any
  static providers: string[] = []
  static frameworks: string[] = []
  static libraries: Map<string, string[]>
  static summary = 'Generates a reference application that integrates Affinidi Login. Requires git'
  static examples = [
    '<%= config.bin %> <%= command.id %>',
    '<%= config.bin %> <%= command.id %> -p "../my-app" -f django -a affinidi',
    '<%= config.bin %> <%= command.id %> --path "../my-app" --framework django --provider affinidi --force',
  ]

  static flags = {
    framework: Flags.string({
      char: 'f',
      summary: 'Framework for the reference app',
      options: [],
    }),
    provider: Flags.string({
      char: 'a',
      summary: 'Authentication provider for the reference app',
      options: [],
    }),
    path: Flags.string({
      char: 'p',
      summary: 'Relative or absolute path where reference application should be cloned into',
    }),
    force: Flags.boolean({
      summary: 'Override destination directory if exists',
    }),
  }

  async init() {
    GenerateApp.apps = await getApps(APPS_INFORMATION_GITHUB_LOCATION)
    const { providers, frameworks, libraries } = getSupportedAppsInformation(GenerateApp.apps)
    GenerateApp.providers = providers
    GenerateApp.frameworks = frameworks
    GenerateApp.libraries = libraries

    GenerateApp.flags.framework = Flags.string({
      char: 'f',
      summary: 'Framework for the reference app',
      options: frameworks,
    })
    GenerateApp.flags.provider = Flags.string({
      char: 'a',
      summary: 'Authentication provider for the reference app',
      options: providers,
    })
  }

  public async run(): Promise<void> {
    const { flags } = await this.parse(GenerateApp)
    if (flags['no-input']) {
      if (!flags.provider) throw new CLIError(giveFlagInputErrorMessage('provider'))
      if (!flags.framework) throw new CLIError(giveFlagInputErrorMessage('framework'))
    }
    const provider =
      flags.provider ??
      (await select({
        message: 'Select the provider for the reference app.',
        choices: GenerateApp.providers.map((value) => ({
          name: value,
          value,
        })),
      }))
    const framework =
      flags.framework ??
      (await select({
        message: 'Select the framework for the reference app.',
        choices: GenerateApp.frameworks.map((value) => ({
          name: value,
          value,
        })),
      }))
    const promptFlags = await promptRequiredParameters(['path'], flags)
    promptFlags.framework = framework
    promptFlags.provider = provider

    const schema = z.object({
      path: z.string().max(INPUT_LIMIT),
      framework: z.string().max(INPUT_LIMIT),
      provider: z.string().max(INPUT_LIMIT),
    })
    const validatedFlags = schema.parse(promptFlags)
    const appName = getAppName(framework, provider, GenerateApp.libraries)

    ux.action.start('Generating reference application')

    await cloneWithDegit(`${APPS_GITHUB_LOCATION}/${appName}`, validatedFlags.path, flags.force)

    ux.action.stop('Generated successfully!')

    if (!flags['no-input']) {
      const configure = await confirm({
        message: 'Automatically configure reference app environment?',
      })
      if (configure) {
        ux.action.start('Fetching available login configurations')
        const configs = await vpAdapterService.listLoginConfigurations(
          clientSDK.config.getProjectToken()?.projectAccessToken,
        )
        ux.action.stop('Fetched successfully!')
        const choices = configs.configurations.map((config) => ({
          value: {
            id: config.id,
            auth: config.auth,
          },
          name: `${config.name} [id: ${config.id}]`,
        }))
        const selectedConfig = await select({
          message: 'Select a login configuration to use in your reference application',
          choices,
        })
        const clientSecret = validateInputLength(
          await password({
            message: "What is the login configuration's client secret?",
            mask: true,
          }),
          INPUT_LIMIT,
        )

        if (provider === RefAppProvider.AFFINIDI) {
          ux.action.start('Configuring reference application')
          await configureAppEnvironment(
            validatedFlags.path,
            selectedConfig.auth.clientId,
            clientSecret,
            selectedConfig.auth.issuer,
          )
          ux.action.stop('Configured successfully!')
        } else if (provider === RefAppProvider.AUTH0) {
          const domain = validateInputLength(await input({ message: 'What is your Auth0 tenant URL?' }), INPUT_LIMIT)
          const accessToken = validateInputLength(
            await password({ message: 'What is your Auth0 access token?' }),
            TOKEN_LIMIT,
          )
          ux.action.start('Creating Auth0 resources and configuring reference application')
          const socialConnectionName = `Affinidi-${framework}`
          const { auth0ClientId, auth0ClientSecret, connectionName } = await createAuth0Resources(
            accessToken,
            domain,
            selectedConfig.auth.clientId,
            clientSecret,
            selectedConfig.auth.issuer,
            socialConnectionName,
            {
              callbackUrl: GenerateApp.apps.appName.redirectUris.callbackUrl,
              logOutUrl: GenerateApp.apps.appName.redirectUris.logOutUrl,
              webOriginUrl: GenerateApp.apps.appName.redirectUris.webOriginUrl,
            },
          )
          await configureAppEnvironment(validatedFlags.path, auth0ClientId, auth0ClientSecret, domain, connectionName)
          ux.action.stop('Configured successfully!')
        }
      }
    }

    this.log('Please read the generated README for instructions on how to run your reference application')
  }
}
