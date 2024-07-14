import { password } from '@inquirer/prompts'
import { confirm, input, select } from '@inquirer/prompts'
import { ux, Flags } from '@oclif/core'
import { CLIError } from '@oclif/core/errors'
import z from 'zod'
import { BaseCommand } from '../../common/base-command.js'
import { giveFlagInputErrorMessage } from '../../common/error-messages.js'
import { promptRequiredParameters } from '../../common/prompts.js'
import { INPUT_LIMIT, TOKEN_LIMIT, validateInputLength } from '../../common/validators.js'
import { AppsInformation, getAppName, getApps, getRedirectUri, getSupportedAppsInformation } from '../../helpers/app.js'
import { cloneWithDegit } from '../../helpers/degit.js'
import { vpAdapterService } from '../../services/affinidi/vp-adapter/service.js'
import { createAuth0Resources } from '../../services/generator/auth0.js'
import { configureAppEnvironment } from '../../services/generator/env-configurer.js'
import { RefAppProvider } from '../../common/constants.js'

const APPS_INFORMATION_GITHUB_LOCATION = 'samples/apps.json'
const APPS_GITHUB_LOCATION = 'affinidi/reference-app-affinidi-vault/samples'

export default class GenerateApp extends BaseCommand<typeof GenerateApp> {
  static apps: AppsInformation
  static providers: string[] = []
  static frameworks: Map<string, string[]>
  static libraries: Map<string, string[]>
  static summary = 'Generates code samples that integrates Affinidi Login. Requires git'
  static examples = [
    '<%= config.bin %> <%= command.id %>',
    '<%= config.bin %> <%= command.id %> -p "../my-app" -f django -a affinidi',
    '<%= config.bin %> <%= command.id %> --path "../my-app" --framework django --provider affinidi --force',
  ]

  static flags = {
    provider: Flags.string({
      char: 'a',
      summary: 'Authentication provider for the sample app',
    }),
    framework: Flags.string({
      char: 'f',
      summary: 'Framework for the sample app',
    }),
    library: Flags.string({
      char: 'l',
      summary: 'Library for the sample app',
    }),
    path: Flags.string({
      char: 'p',
      summary: 'Relative or absolute path where sample app should be cloned into',
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

    GenerateApp.flags.provider = Flags.string({
      char: 'a',
      summary: 'Authentication provider for the sample app',
      options: providers,
    })
  }

  public async run(): Promise<void> {
    try {
      const { flags } = await this.parse(GenerateApp)
      if (flags['no-input']) {
        if (!flags.provider) throw new CLIError(giveFlagInputErrorMessage('provider'))
        if (!flags.framework) throw new CLIError(giveFlagInputErrorMessage('framework'))
      }
      const provider =
        flags.provider ??
        (await select({
          message: 'Select the provider for the sample app.',
          choices: GenerateApp.providers.map((value) => ({
            name: value,
            value,
          })),
        }))
      const framework =
        flags.framework ??
        (await select({
          message: 'Select the framework for the sample app.',
          choices: GenerateApp.frameworks.get(provider)!.map((value) => ({
            name: value,
            value,
          })),
        }))
      const library =
        flags.library ??
        (await select({
          message: 'Select the library for the sample app.',
          choices: GenerateApp.libraries.get(`${provider}-${framework}`)!.map((value) => ({
            name: value,
            value,
          })),
        }))

      const promptFlags = await promptRequiredParameters(['path'], flags)
      promptFlags.framework = framework
      promptFlags.provider = provider
      promptFlags.library = library

      const schema = z.object({
        path: z.string().max(INPUT_LIMIT),
        framework: z.string().max(INPUT_LIMIT),
        provider: z.string().max(INPUT_LIMIT),
        library: z.string().max(INPUT_LIMIT),
      })
      const validatedFlags = schema.parse(promptFlags)
      const appName = getAppName(framework, provider, library)

      ux.action.start('Generating sample app')

      await cloneWithDegit(`${APPS_GITHUB_LOCATION}/${appName}`, validatedFlags.path, flags.force)

      ux.action.stop('Generated successfully!')

      if (!flags['no-input']) {
        const configure = await confirm({
          message: 'Automatically configure sample app environment?',
        })
        if (configure) {
          ux.action.start('Fetching available login configurations')
          const configs = await vpAdapterService.listLoginConfigurations()
          ux.action.stop('Fetched successfully!')
          const choices = configs.configurations.map((config) => ({
            value: {
              id: config.configurationId,
              auth: config.auth,
            },
            name: `${config.name} [id: ${config.configurationId}]`,
          }))
          choices.push({
            value: {
              id: 'new-config',
              auth: undefined,
            },
            name: 'Create new login config',
          })
          const selectedConfig = await select({
            message: 'Select a login configuration to use in your sample app',
            choices,
          })
          let newConfigClientSecret = undefined
          // Create a new login config
          if (selectedConfig.id === 'new-config') {
            const newConfigName = validateInputLength(
              await input({ message: `Enter a name for the login config` }),
              INPUT_LIMIT,
            )
            const redirectUri = getRedirectUri(GenerateApp.apps, appName)
            const createLoginConfigInput = {
              name: newConfigName,
              redirectUris: [redirectUri],
            }
            const createConfigOutput = await vpAdapterService.createLoginConfig(createLoginConfigInput)
            this.warn(
              this.chalk.red.bold(
                'Please save the clientSecret somewhere safe. You will not be able to view it again.',
              ),
            )
            this.logJson({ loginConfig: createConfigOutput.auth })
            selectedConfig.id = createConfigOutput.configurationId
            selectedConfig.auth = createConfigOutput.auth
            newConfigClientSecret = createConfigOutput.auth.clientSecret
          }

          const clientSecret =
            newConfigClientSecret ??
            validateInputLength(
              await password({
                message: "What is the login configuration's client secret?",
                mask: true,
              }),
              INPUT_LIMIT,
            )

          if (provider === RefAppProvider.AFFINIDI) {
            ux.action.start('Configuring sample app')
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
            ux.action.start('Creating Auth0 resources and configuring sample app')
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

      this.log('Please read the generated README for instructions on how to run your sample app')
    } catch (err: any) {
      if (!err?.oclif) throw new CLIError('Unexpected error while generating sample app')
      else throw new CLIError(err)
    }
  }
}
