import { input, password } from '@inquirer/prompts'
import select from '@inquirer/select'
import { ux } from '@oclif/core'
import { BaseCommand } from '../../common'
import { auth0Service } from '../../services/auth0'

export class GenerateApplication extends BaseCommand<typeof GenerateApplication> {
  static summary = 'Generates a reference application with filled credentials'
  static examples = ['<%= config.bin %> <%= command.id %>']

  public async run(): Promise<void> {
    const appPath = await input({ message: 'Please provide the path of the reference app.' })

    const idps = [
      {
        name: 'Auth0',
        value: 'Auth0',
      },
    ]

    const idp = await select({
      message: 'Which IDP do you wish to generate with?',
      choices: idps,
    })

    const clientId = await input({ message: 'What is your Affinidi login configurations clientId?' })

    const clientSecret = await password({
      message: 'What is your Affinidi login configurations clientSecret?',
      mask: true,
    })

    let accessToken: string
    let domain: string

    switch (idp.toLowerCase()) {
      default: {
        domain = await input({ message: 'What is your tenant domain?' })
        accessToken = await password({ message: 'What is your IDP access token?', mask: true })
      }
    }

    ux.action.start('Generating reference application')

    switch (idp.toLowerCase()) {
      default: {
        await auth0Service.generateAuth0Application(accessToken, domain, clientId, clientSecret, appPath)
      }
    }

    ux.action.stop('Generated successfully!')
  }
}
