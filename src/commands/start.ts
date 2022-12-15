import { CliUx, Command } from '@oclif/core'
import { wizardStatusMessage, wizardStatus } from '../render/functions'

import { isAuthenticated } from '../middleware/authentication'
import { selectNextStep } from '../user-actions/inquirer'
import Login from './login'
import SignUp from './sign-up'
import { getSession } from '../services/user-management'
import { iAmService } from '../services'
import CreateProject from './create/project'

export default class Start extends Command {
  static description = 'describe the command here'

  static examples = ['<%= config.bin %> <%= command.id %>']

  static isWizard = true

  public async run(): Promise<void> {
    if (!isAuthenticated()) {
      CliUx.ux.info(wizardStatusMessage(wizardStatus({ breadcrumbs: [] })))
      const nextStep = await selectNextStep(['login', 'sign-up'])
      switch (nextStep) {
        case 'login':
          Login.run(['-w'])
          break
        default:
          SignUp.run(['-w'])
          break
      }
    }
    const { consoleAuthToken: token } = getSession()
    const projects = await iAmService.listProjects(token, 0, 10)
    if (projects.length === 0) {
      CreateProject.run([])
    } else {
    }
  }
}
