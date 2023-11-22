import { ux } from '@oclif/core'
import chalk from 'chalk'
import { BaseCommand } from '../common'
import { bffService } from '../services/affinidi/bff-service'

export class Start extends BaseCommand<typeof Start> {
  static summary = 'Log in to Affinidi'
  static examples = ['<%= config.bin %> <%= command.id %>']

  public async run(): Promise<void> {
    ux.action.start('Authenticating in browser')
    try {
      await bffService.login()
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
