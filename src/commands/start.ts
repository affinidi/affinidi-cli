import { CliUx, Command } from '@oclif/core'
import { wizardStatusMessage, wizardStatus } from '../render/functions'

import { isAuthenticated } from '../middleware/authentication'
import { selectNextStep } from '../user-actions/inquirer'
import Login from './login'
import SignUp from './sign-up'
import { getSession } from '../services/user-management'
import { iAmService } from '../services'
import CreateProject from './create/project'
import Logout from './logout'

export default class Start extends Command {
  static description = 'describe the command here'

  static examples = ['<%= config.bin %> <%= command.id %>']

  static isWizard = true

  public async run(): Promise<void> {
    let breadCrumbs: string[]
    if (!isAuthenticated()) {
      CliUx.ux.info(wizardStatusMessage(wizardStatus({ breadcrumbs: breadCrumbs })))
      const nextStep = await selectNextStep(['login', 'sign-up'])
      switch (nextStep) {
        case 'login':
          Login.run(['-w'])
          breadCrumbs.push(nextStep)
          break
        default:
          SignUp.run(['-w'])
          breadCrumbs.push(nextStep)
          break
      }
    }
    const { consoleAuthToken: token } = getSession()
    const projects = await iAmService.listProjects(token, 0, 10)
    if (projects.length === 0) {
      CreateProject.run([])
      breadCrumbs.push('create a project')
    }
    let nextStep = await selectNextStep([
      'manage projects',
      'manage schemas',
      'generate an application',
      'issue a vc',
      'verify a vc',
      'logout',
    ])
    switch (nextStep) {
      case 'manage projects':
        break
      case 'manage schemas':
        break
      case 'generate an application':
        break
      case 'issue a vc':
        break
      case 'verify a vc':
        break
      case 'logout':
        Logout.run([])
        breadCrumbs.push(nextStep)
        break
      default:
        break
    }
  }
}
