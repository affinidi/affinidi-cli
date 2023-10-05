import password from '@inquirer/password'
import { confirm, input, select } from '@inquirer/prompts'
import { ux, Flags } from '@oclif/core'
import { CLIError } from '@oclif/core/lib/errors'
import chalk from 'chalk'
import z from 'zod'
import { BaseCommand, RefAppSamples } from '../../common'
import { promptRequiredParameters } from '../../helpers'
import { cloneWithDegit } from '../../helpers/degit'
import { giveFlagInputErrorMessage } from '../../helpers/generate-error-message'
import { INPUT_LIMIT, validateInputLength } from '../../helpers/input-length-validation'
import { clientSDK } from '../../services/affinidi'
import { vpAdapterService } from '../../services/affinidi/vp-adapter'
import { createAuth0Resources } from '../../services/generator/auth0'
import { configureAppEnvironment } from '../../services/generator/env-configurer'

const APPS_GITHUB_LOCATION = 'affinidi/reference-app-affinidi-vault/samples'

export default class GenerateApp extends BaseCommand<typeof GenerateApp> {
  static summary = 'Generates a NextJS reference application that integrates Affinidi Login. Requires git'
  static examples = [
    '<%= config.bin %> <%= command.id %>',
    '<%= config.bin %> <%= command.id %> -p "../my-app" -s affinidi-nextjs-nextauthjs',
    '<%= config.bin %> <%= command.id %> --path "../my-app" --sample auth0-nextjs-nextauthjs --force',
  ]

  static flags = {
    sample: Flags.string({
      char: 's',
      summary: 'Sample to generate',
      description: `Use ${chalk.italic(
        'affinidi-nextjs-nextauthjs',
      )} to generate a Next.js+NextAuth.js app that integrates Affinidi Login directly\n\
      Use ${chalk.italic(
        'auth0-nextjs-nextauthjs',
      )} to generate a Next.js+NextAuth.js app that integrates Affinidi Login through Auth0`,
      options: Object.values(RefAppSamples),
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
    if (flags['no-input'] && !flags.sample) {
      throw new CLIError(giveFlagInputErrorMessage('sample'))
    }
    const sample =
      flags.sample ??
      (await select({
        message: `Select the app to generate. ${chalk.italic('affinidi-*')} for basic Affinidi Login, ${chalk.italic(
          'auth0-*',
        )} for Affinidi Login through Auth0`,
        choices: Object.values(RefAppSamples).map((value) => ({
          name: value,
          value,
        })),
      }))
    const promptFlags = await promptRequiredParameters(['path'], flags)
    const schema = z.object({
      path: z.string().max(INPUT_LIMIT),
      sample: z.string().max(INPUT_LIMIT),
    })
    const validatedFlags = schema.parse(promptFlags)

    ux.action.start('Generating reference application')
    await cloneWithDegit(`${APPS_GITHUB_LOCATION}/${sample}`, validatedFlags.path, flags.force)
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

        if (sample === RefAppSamples.AFFINIDI_NEXTJS_NEXTAUTHJS) {
          ux.action.start('Configuring reference application')
          await configureAppEnvironment(
            validatedFlags.path,
            selectedConfig.auth.clientId,
            clientSecret,
            selectedConfig.auth.issuer,
          )
          ux.action.stop('Configured successfully!')
        } else if (sample === RefAppSamples.AUTH0_NEXTJS_NEXTAUTHJS) {
          const domain = validateInputLength(await input({ message: 'What is your Auth0 tenant URL?' }), INPUT_LIMIT)
          const accessToken = validateInputLength(
            await password({ message: 'What is your Auth0 access token?' }),
            INPUT_LIMIT,
          )
          ux.action.start('Creating Auth0 resources and configuring reference application')
          const { auth0ClientId, auth0ClientSecret, connectionName } = await createAuth0Resources(
            accessToken,
            domain,
            selectedConfig.auth.clientId,
            clientSecret,
            selectedConfig.auth.issuer,
          )
          await configureAppEnvironment(validatedFlags.path, auth0ClientId, auth0ClientSecret, domain, connectionName)
          ux.action.stop('Configured successfully!')
        }
      }
    }

    this.log('Please read the generated README for instructions on how to run your reference application')
  }
}
