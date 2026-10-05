import { select } from '@inquirer/prompts'
import { Flags, ux } from '@oclif/core'
import chalk from 'chalk'
import { BaseCommand } from '../common/base-command.js'
import { LoginAuthMethods, LoginProviders } from '../common/constants.js'
import { bffService } from '../services/affinidi/bff-service.js'

const EMAIL_LOGIN = 'email'

const loginProviderChoices = [
  { name: 'Affinidi Vault', value: LoginProviders.AFFINIDI },
  { name: 'Google', value: LoginProviders.GOOGLE },
  { name: 'Microsoft', value: LoginProviders.MICROSOFT },
  { name: 'Apple', value: LoginProviders.APPLE },
  { name: 'GitHub', value: LoginProviders.GITHUB },
  { name: 'Email (one-time code)', value: EMAIL_LOGIN },
]

export class Start extends BaseCommand<typeof Start> {
  static summary = 'Log in to Affinidi'
  static examples = [
    '<%= config.bin %> <%= command.id %>',
    '<%= config.bin %> <%= command.id %> --provider github',
    '<%= config.bin %> <%= command.id %> --provider email',
  ]
  static flags = {
    provider: Flags.string({
      char: 'p',
      summary: 'Login provider to authenticate with',
      description:
        'Use "email" to log in with a one-time code sent to your email. Prompts for a provider if omitted. With --no-input, defaults to Affinidi Vault.',
      options: [...Object.values(LoginProviders), EMAIL_LOGIN],
    }),
  }

  public async run(): Promise<void> {
    const { flags } = await this.parse(Start)
    // Without a provider the login UI falls back to Affinidi Vault, keeping --no-input scripts unchanged.
    const selection =
      flags.provider ??
      (flags['no-input'] ? undefined : await select({ message: 'Select how to log in', choices: loginProviderChoices }))
    const loginOption =
      selection === EMAIL_LOGIN
        ? { authMethod: LoginAuthMethods.OTC }
        : { provider: selection as LoginProviders | undefined }

    ux.action.start('Authenticating in browser')
    try {
      await bffService.login(loginOption)
      const activeProject = await bffService.getActiveProject()
      ux.action.stop('Authenticated successfully!')
      this.log(
        `\nYour active project has been set to the project ${chalk.underline(
          activeProject.name,
        )} with ID ${chalk.underline(activeProject.id)}` +
          '\n\nIf you want to change the active project, please follow these steps:' +
          `\n\n💡 To list all your projects run: ${chalk.inverse('affinidi project list-projects')}` +
          `\n\n💡 To change the active project run: ${chalk.inverse(
            'affinidi project select-project -i <project-id>',
          )}\n`,
      )
    } catch (error) {
      ux.action.stop('Authentication failed!')
      this.error(error as string)
    }
  }
}
