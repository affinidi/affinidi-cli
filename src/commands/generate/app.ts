import password from '@inquirer/password'
import { input } from '@inquirer/prompts'
import { ux, Flags } from '@oclif/core'
import { CLIError } from '@oclif/core/lib/errors'
import { BaseCommand } from '../../common'
import { promptRequiredParameters } from '../../helpers'
import { cloneWithDegit } from '../../helpers/degit'
import { giveFlagInputErrorMessage } from '../../helpers/generate-error-message'
import { auth0Service } from '../../services/auth0'

const GIT_URL = `affinidi/reference-app-affinidi-vault/use-cases/default`

export default class GenerateApp extends BaseCommand<typeof GenerateApp> {
  static summary = 'Generates a reference application and configures an Auth0 connection. Requires git'
  static examples = [
    '<%= config.bin %> <%= command.id %>',
    '<%= config.bin %> <%= command.id %> -p <destination_path>',
    '<%= config.bin %> <%= command.id %> --path <destination_path> --force',
  ]

  static flags = {
    path: Flags.string({
      char: 'p',
      summary: 'Relative or absolute path where reference application should be cloned into',
    }),
    force: Flags.boolean({
      summary: 'Override destination directory if exists',
    }),
    'client-id': Flags.string({
      summary: 'Affinidi login configurations clientId',
    }),
    'client-secret': Flags.string({
      summary: 'Affinidi login configurations clientSecret',
    }),
    'access-token': Flags.string({
      summary: 'IDP access token',
    }),
    domain: Flags.string({
      summary: 'Tenant domain',
    }),
  }

  public async run(): Promise<void> {
    const { flags } = await this.parse(GenerateApp)
    const promptFlags = await promptRequiredParameters(['path'], flags)

    ux.action.start('Generating reference application')
    await cloneWithDegit(GIT_URL, promptFlags.path, flags.force)
    ux.action.stop('Generated successfully!')

    if (flags['no-input']) {
      if (!flags['client-id']) {
        throw new CLIError(giveFlagInputErrorMessage('client-id'))
      }
      if (!flags['client-secret']) {
        throw new CLIError(giveFlagInputErrorMessage('client-secret'))
      }
      if (!flags['access-token']) {
        throw new CLIError(giveFlagInputErrorMessage('access-token'))
      }
      if (!flags.domain) {
        throw new CLIError(giveFlagInputErrorMessage('domain'))
      }
    }

    const clientId =
      flags['client-id'] ?? (await input({ message: 'What is your Affinidi login configurations clientId?' }))

    const clientSecret =
      flags['client-secret'] ??
      (await password({
        message: 'What is your Affinidi login configurations clientSecret?',
        mask: true,
      }))

    const accessToken = flags['access-token'] ?? (await password({ message: 'What is your IDP access token?' }))

    const domain = flags.domain ?? (await input({ message: 'What is your tenant domain?' }))

    ux.action.start('Configuring Auth0 application')
    await auth0Service.generateAuth0Application(accessToken, domain, clientId, clientSecret, promptFlags.path)
    ux.action.stop('Configured successfully!')
  }
}
