import password from '@inquirer/password'
import { input } from '@inquirer/prompts'
import { ux, Flags } from '@oclif/core'
import chalk from 'chalk'
import shell from 'shelljs'
import { CLIError } from '@oclif/core/lib/errors'
import { BaseCommand } from '../../common'
import { promptRequiredParameters } from '../../helpers'
import { auth0Service } from '../../services/auth0'

const REFERENCE_APP_REPO_NAME = 'reference-app-affinidi-vault'
const REFERENCE_APP_SUB_DIRECTORY = 'use-cases/default'
const GIT_URL = `affinidi/${REFERENCE_APP_REPO_NAME}/${REFERENCE_APP_SUB_DIRECTORY}`

export default class GenerateApp extends BaseCommand<typeof GenerateApp> {
  static summary = 'Clone a reference application and create Auth0 connection'
  static examples = [
    '<%= config.bin %> <%= command.id %>',
    '<%= config.bin %> <%= command.id %> -p <PATH_WHERE_TO_CLONE_REFERENCE_APP>',
    '<%= config.bin %> <%= command.id %> --path <PATH_WHERE_TO_CLONE_REFERENCE_APP> --force',
  ]

  static flags = {
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
    const promptFlags = await promptRequiredParameters(['path'], flags)
    const appPath = promptFlags.path

    ux.action.start('Cloning reference application')

    // NOTE: using shelljs instead of child_process as shelljs handles errors better
    const { code, stderr } = shell.exec(`npx degit ${GIT_URL} ${appPath} ${flags.force ? '--force' : ''}`)

    if (code !== 0) {
      ux.action.stop('Failed 🧨')

      this.exit(1)
    } else {
      ux.action.stop('Cloned successfully!')
    }

    const clientId = await input({ message: 'What is your Affinidi login configurations clientId?' })

    const clientSecret = await password({
      message: 'What is your Affinidi login configurations clientSecret?',
      mask: true,
    })

    const accessToken = await password({ message: 'What is your IDP access token?' })

    const domain = await input({ message: 'What is your tenant domain?' })

    ux.action.start('Generating Auth0 application')
    await auth0Service.generateAuth0Application(accessToken, domain, clientId, clientSecret, appPath)
    ux.action.stop()
  }
}
