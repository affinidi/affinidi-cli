import password from '@inquirer/password'
import { confirm, input, select } from '@inquirer/prompts'
import { ux, Flags } from '@oclif/core'
import { CLIError } from '@oclif/core/lib/errors'
import chalk from 'chalk'
import { BaseCommand, RefAppUseCases } from '../../common'
import { promptRequiredParameters } from '../../helpers'
import { cloneWithDegit } from '../../helpers/degit'
import { giveFlagInputErrorMessage } from '../../helpers/generate-error-message'
import { clientSDK } from '../../services/affinidi'
import { vpAdapterService } from '../../services/affinidi/vp-adapter'
import { createAuth0Resources } from '../../services/generator/auth0'
import { configureAppEnvironment } from '../../services/generator/env-configurer'

const APPS_GITHUB_LOCATION = 'affinidi/reference-app-affinidi-vault/use-cases'

export default class GenerateApp extends BaseCommand<typeof GenerateApp> {
  static summary = 'Generates a NextJS reference application that integrates Affinidi Login. Requires git'
  static examples = [
    '<%= config.bin %> <%= command.id %>',
    '<%= config.bin %> <%= command.id %> -p "../my-app" -u affinidi',
    '<%= config.bin %> <%= command.id %> --path "../my-app" --use-case auth0 --force',
  ]

  static flags = {
    'use-case': Flags.string({
      char: 'u',
      summary: 'Use case to generate',
      description: `Use ${chalk.italic('affinidi')} to generate an app that integrates Affinidi Login directly\n\
      Use ${chalk.italic('auth0')} to generate an app that integrates Affinidi Login through Auth0`,
      options: Object.values(RefAppUseCases),
    }),
    path: Flags.string({
      char: 'p',
      summary: 'Relative or absolute path where reference application should be cloned into',
    }),
    force: Flags.boolean({
      summary: 'Override destination directory if exists',
    }),
  }

  public async run(): Promise<void> {
    const { flags } = await this.parse(GenerateApp)
    if (flags['no-input'] && !flags['use-case']) {
      throw new CLIError(giveFlagInputErrorMessage('use-case'))
    }
    const useCase =
      flags['use-case'] ??
      (await select({
        message: `Select the app to generate. ${chalk.italic('affinidi')} for basic Affinidi Login, ${chalk.italic(
          'auth0',
        )} for Affinidi Login through Auth0`,
        choices: Object.values(RefAppUseCases).map((value) => ({
          name: value,
          value,
        })),
      }))
    const promptFlags = await promptRequiredParameters(['path'], flags)

    ux.action.start('Generating reference application')
    await cloneWithDegit(`${APPS_GITHUB_LOCATION}/${useCase}`, promptFlags.path, flags.force)
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
        const clientSecret = await password({
          message: "What is the login configuration's client secret?",
          mask: true,
        })

        if (useCase === RefAppUseCases.AFFINIDI) {
          ux.action.start('Configuring reference application')
          await configureAppEnvironment(
            promptFlags.path,
            selectedConfig.auth.clientId,
            clientSecret,
            selectedConfig.auth.issuer,
          )
          ux.action.stop('Configured successfully!')
        } else if (useCase === RefAppUseCases.AUTH0) {
          const domain = await input({ message: 'What is your Auth0 tenant URL?' })
          const accessToken = await password({ message: 'What is your Auth0 access token?' })
          ux.action.start('Creating Auth0 resources and configuring reference application')
          const { auth0ClientId, auth0ClientSecret, connectionName } = await createAuth0Resources(
            accessToken,
            domain,
            selectedConfig.auth.clientId,
            clientSecret,
            selectedConfig.auth.issuer,
          )
          await configureAppEnvironment(promptFlags.path, auth0ClientId, auth0ClientSecret, domain, connectionName)
          ux.action.stop('Configured successfully!')
        }
      }
    }

    this.log('Please read the generated README for instructions on how to run your reference application')
  }
}
