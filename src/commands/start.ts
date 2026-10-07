import { Flags, ux } from '@oclif/core'
import chalk from 'chalk'
import { BaseCommand } from '../common/base-command.js'
import { LoginProviders } from '../common/constants.js'
import { bffService } from '../services/affinidi/bff-service.js'

export class Start extends BaseCommand<typeof Start> {
  static summary = 'Log in to Affinidi'
  static examples = ['<%= config.bin %> <%= command.id %>', '<%= config.bin %> <%= command.id %> --provider github']
  static flags = {
    provider: Flags.option({
      summary: 'Login provider to authenticate with',
      description: 'If omitted, the default login page opens.',
      options: Object.values(LoginProviders),
    })(),
  }

  public async run(): Promise<void> {
    const { flags } = await this.parse(Start)
    // No prompt here: existing scripts run `start` without flags and must not block on input.
    const { provider } = flags
    this.logProviderHint(provider)

    ux.action.start('Authenticating in browser')
    try {
      await bffService.login(provider)
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

  // Surfaces --provider to users who would otherwise only find it via --help.
  private logProviderHint(provider?: LoginProviders): void {
    if (provider) {
      this.log(`Logging in with ${chalk.bold(provider)}.\n`)
      return
    }

    const usage = `affinidi start --provider <${Object.values(LoginProviders).join('|')}>`
    this.log(`Logging in via the default login page.\n💡 To log in with a specific provider run: ${usage}\n`)
  }
}
