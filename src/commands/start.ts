import { select } from '@inquirer/prompts'
import { Flags, ux } from '@oclif/core'
import chalk from 'chalk'
import { BaseCommand } from '../common/base-command.js'
import { LoginProviders } from '../common/constants.js'
import { bffService } from '../services/affinidi/bff-service.js'

const loginProviderChoices = [
  { name: 'Affinidi Vault', value: LoginProviders.AFFINIDI },
  { name: 'Google', value: LoginProviders.GOOGLE },
  { name: 'Microsoft', value: LoginProviders.MICROSOFT },
  { name: 'Apple', value: LoginProviders.APPLE },
  { name: 'GitHub', value: LoginProviders.GITHUB },
]

export class Start extends BaseCommand<typeof Start> {
  static summary = 'Log in to Affinidi'
  static examples = ['<%= config.bin %> <%= command.id %>', '<%= config.bin %> <%= command.id %> --provider github']
  static flags = {
    provider: Flags.string({
      char: 'p',
      summary: 'Login provider to authenticate with',
      description: 'Prompts for a provider if omitted. With --no-input, defaults to Affinidi Vault.',
      options: Object.values(LoginProviders),
    }),
  }

  public async run(): Promise<void> {
    const { flags } = await this.parse(Start)
    // Without a provider the login UI falls back to Affinidi Vault, keeping --no-input scripts unchanged.
    const provider =
      (flags.provider as LoginProviders | undefined) ??
      (flags['no-input'] ? undefined : await select({ message: 'Select how to log in', choices: loginProviderChoices }))

    ux.action.start('Authenticating in browser')
    try {
      await bffService.login({ provider })
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
