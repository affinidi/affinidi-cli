import password from '@inquirer/password'
import { confirm, input, select } from '@inquirer/prompts'
import { ux, Flags } from '@oclif/core'
import { CLIError } from '@oclif/core/lib/errors'
import z from 'zod'
import { BaseCommand, RefAppProvider, SupportedAlgorithms } from '../../common'
import { giveFlagInputErrorMessage } from '../../common/error-messages'
import { promptRequiredParameters } from '../../common/prompts'
import { INPUT_LIMIT, TOKEN_LIMIT, validateInputLength } from '../../common/validators'
import {
  AppsInformation,
  getAppMetadataToken,
  getAppName,
  getApps,
  getRedirectUri,
  getSupportedAppsInformation,
} from '../../helpers/app'
import { cloneWithDegit } from '../../helpers/degit'
import { addPrincipal, createToken, generateKeyPair, updatePolicies } from '../../helpers/token'
import { vpAdapterService } from '../../services/affinidi/vp-adapter'
import { createAuth0Resources } from '../../services/generator/auth0'
import { configureAppEnvironment } from '../../services/generator/env-configurer'
import { v4 as uuidv4 } from 'uuid'
import { JsonWebKeySetDto } from '../../services/affinidi/iam/iam.api'
import { bffService } from '../../services/affinidi/bff-service'

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
          message: 'Select the provider for the sample app',
          choices: GenerateApp.providers.map((value) => ({
            name: value,
            value,
          })),
        }))

      // Make nextjs first option
      const frameworks = GenerateApp.frameworks.get(provider)!
      const nextJsIndex = frameworks.indexOf('nextjs')
      if (nextJsIndex > 0) {
        frameworks.unshift(frameworks.splice(nextJsIndex, 1)[0])
      }
      const framework =
        flags.framework ??
        (await select({
          message: 'Select the framework for the sample app',
          choices: frameworks.map((value) => ({
            name: value,
            value,
          })),
        }))
      const library =
        flags.library ??
        (await select({
          message: 'Select the library for the sample app',
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
      // await cloneWithDegit(`${APPS_GITHUB_LOCATION}/${appName}#token-metadata`, validatedFlags.path, flags.force)

      ux.action.stop('Generated successfully!')

      if (!flags['no-input']) {
        const configureLogin = await confirm({
          message: 'Automatically configure Affinidi Login?',
        })
        if (configureLogin) {
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
          choices.unshift({
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
          // Create a new login config
          if (selectedConfig.id === 'new-config') {
            const newConfigName = validateInputLength(
              await input({
                message: `Enter a name for the login config`,
                default: `sample-login-config-${Math.random().toString(36).slice(2, 7)}`,
              }),
              INPUT_LIMIT,
            )
            ux.action.start('Creating login configuration')
            const redirectUri = getRedirectUri(GenerateApp.apps, appName)
            const createLoginConfigInput = {
              name: newConfigName,
              redirectUris: [redirectUri],
            }
            const createConfigOutput = await vpAdapterService.createLoginConfig(createLoginConfigInput)
            ux.action.stop('Created successfully!')
            this.logJson({ loginConfig: createConfigOutput.auth })
            this.warn(
              this.chalk.yellowBright.bold(
                "\nPlease save the clientSecret somewhere safe. It will be added to the app env's file. You will not be able to view it again.\n",
              ),
            )
            selectedConfig.id = createConfigOutput.configurationId
            selectedConfig.auth = createConfigOutput.auth
          }

          let clientId = selectedConfig.auth.clientId
          let clientSecret = selectedConfig.auth.clientSecret
          let issuer = selectedConfig.auth.issuer
          let connectionName

          clientSecret ??= validateInputLength(
            await password({
              message: "What is the login configuration's client secret?",
              mask: true,
            }),
            INPUT_LIMIT,
          )

          if (provider === RefAppProvider.AUTH0) {
            const domain = validateInputLength(await input({ message: 'What is your Auth0 tenant URL?' }), INPUT_LIMIT)
            const accessToken = validateInputLength(
              await password({ message: 'What is your Auth0 access token?' }),
              TOKEN_LIMIT,
            )
            ux.action.start('Creating Auth0 resources')
            connectionName = `Affinidi-${framework}`
            const { auth0ClientId, auth0ClientSecret } = await createAuth0Resources(
              accessToken,
              domain,
              selectedConfig.auth.clientId,
              clientSecret,
              selectedConfig.auth.issuer,
              connectionName,
              {
                callbackUrl: GenerateApp.apps.appName.redirectUris.callbackUrl,
                logOutUrl: GenerateApp.apps.appName.redirectUris.logOutUrl!,
                webOriginUrl: GenerateApp.apps.appName.redirectUris.webOriginUrl!,
              },
            )
            clientId = auth0ClientId
            clientSecret = auth0ClientSecret
            issuer = domain
            ux.action.stop('Created successfully!')
          }

          const tokenMetadata = getAppMetadataToken(GenerateApp.apps, appName)
          let tokenParams
          if (tokenMetadata) {
            const configureToken = await confirm({
              message:
                'Configure Personal Access Token to enable features like credential issuance and Affinidi Iota Framework?',
            })
            if (configureToken) {
              ux.action.start('Creating Personal Access Token and assigning app permissions on active project')
              const keypair = generateKeyPair(uuidv4(), SupportedAlgorithms.RS256)
              const jwks = keypair.jwks as JsonWebKeySetDto
              const tokenName = `sample-app-token-${Math.random().toString(36).slice(2, 7)}`
              const token = await createToken(tokenName, SupportedAlgorithms.RS256, jwks)
              const promises = [addPrincipal(token.id), bffService.getActiveProject()]
              const [, activeProject] = await Promise.all(promises)
              const projectId = activeProject!.id
              await updatePolicies(token.id, projectId, tokenMetadata.policy.actions, [`*:${projectId}:*`])
              tokenParams = {
                projectId,
                tokenId: token.id,
                privateKey: keypair.privateKey as string,
              }
              ux.action.stop('Created successfully!')
              this.logJson(tokenParams)
              this.warn(
                this.chalk.yellowBright.bold(
                  "\nPlease save the privateKey somewhere safe. It will be added to the app env's file. You will not be able to view it again.\n",
                ),
              )
            }
          }
          await configureAppEnvironment(
            validatedFlags.path,
            {
              clientId,
              clientSecret,
              issuer,
              connectionName,
            },
            tokenParams,
          )
        }
      }
      this.log('\nPlease read the generated README for instructions on how to run your sample app\n')
    } catch (err: any) {
      if (!err?.oclif) throw new CLIError('Unexpected error while generating sample app')
      else throw new CLIError(err)
    }
  }
}
