import { CliUx, Command } from '@oclif/core'
import { wizardStatusMessage, wizardStatus, defaultWizardMessages } from '../render/functions'

import { isAuthenticated } from '../middleware/authentication'
import { selectNextStep } from '../user-actions/inquirer'
import Login from './login'
import SignUp from './sign-up'
import { getSession } from '../services/user-management'
import { iAmService } from '../services'
import { vaultService } from '../services/vault/typedVaultService'
import CreateProject from './create/project'
import Logout from './logout'
import { CliError, getErrorOutput } from '../errors'
import { displayOutput } from '../middleware/display'
import { wizardMap, WizardMenus } from '../constants'
import { applicationName, pathToVc, withProxy } from '../user-actions'
import VerifyVc from './verify-vc'
import GenerateApplication from './generate-application'

export default class Start extends Command {
  static description = 'Start provides a way to guide you from end to end.'

  static command = 'affinidi start'

  static usage = 'start'

  static examples = ['<%= config.bin %> <%= command.id %>']

  breadcrumbs: string[] = []

  menuMap = new Map<WizardMenus, () => void>([
    [WizardMenus.AUTH_MENU, this.getAuthmenu.prototype],
    [WizardMenus.MAIN_MENU, this.getMainmenu.prototype],
    [WizardMenus.PROJECT_MENU, this.getProjectmenu.prototype],
    [WizardMenus.SCHEMA_MENU, this.getSchemamenu.prototype],
  ])

  public async run(): Promise<void> {
    if (!isAuthenticated()) {
      await this.getAuthmenu()
    }
    const {
      consoleAuthToken: token,
      account: { label: userEmail },
    } = getSession()
    const projects = await iAmService.listProjects(token, 0, 10)
    if (projects.length === 0) {
      CreateProject.run([])
      this.breadcrumbs.push('create a project')
    }
    const { projectId } = vaultService.getActiveProject().project
    await this.getMainmenu(userEmail, projectId)
  }

  async catch(error: CliError) {
    CliUx.ux.action.stop('failed')
    displayOutput({
      itemToDisplay: getErrorOutput(error, Start.command, Start.usage, Start.description, false),
      err: true,
    })
    const prevStep = this.breadcrumbs[this.breadcrumbs.length - 1]
    wizardMap.forEach((value, key): void => {
      if (value.includes(prevStep)) {
        this.menuMap.get(key)()
      }
    })
  }

  private async getAuthmenu() {
    CliUx.ux.info(
      wizardStatusMessage(
        wizardStatus({ messages: defaultWizardMessages, breadcrumbs: this.breadcrumbs }),
      ),
    )
    const nextStep = await selectNextStep(wizardMap.get(WizardMenus.AUTH_MENU))
    switch (nextStep) {
      case 'login':
        await Login.run(['-w'])
        this.breadcrumbs.push(nextStep)
        break
      case 'sign-up':
        await SignUp.run(['-w'])
        this.breadcrumbs.push(nextStep)
        break
      default:
        process.exit(0)
    }
  }

  private async getMainmenu(userEmail: string, projectId: string) {
    CliUx.ux.info(
      wizardStatusMessage(
        wizardStatus({
          messages: defaultWizardMessages,
          breadcrumbs: this.breadcrumbs,
          userEmail,
          projectId,
        }),
      ),
    )
    const nextStep = await selectNextStep(wizardMap.get(WizardMenus.MAIN_MENU))
    switch (nextStep) {
      case 'manage projects':
        this.breadcrumbs.push(nextStep)
        this.getProjectmenu(userEmail, projectId)
        break
      case 'manage schemas':
        this.breadcrumbs.push(nextStep)
        this.getSchemamenu(userEmail, projectId)
        break
      case 'generate an application':
        GenerateApplication.run([
          `-n ${await applicationName()}`,
          `${(await withProxy()) ? '-w' : ''}`,
        ])
        this.breadcrumbs.push(nextStep)
        break
      case 'issue a vc':
        break
      case 'verify a vc':
        await VerifyVc.run([`-d${await pathToVc()}`])
        this.breadcrumbs.push(nextStep)
        break
      case 'logout':
        this.logout(nextStep)
        break
      default:
        process.exit(0)
    }
  }

  private async getProjectmenu(userEmail: string, projectId: string) {
    CliUx.ux.info(
      wizardStatusMessage(
        wizardStatus({
          messages: defaultWizardMessages,
          breadcrumbs: this.breadcrumbs,
          userEmail,
          projectId,
        }),
      ),
    )
    const nextStep = await selectNextStep(wizardMap.get(WizardMenus.PROJECT_MENU))
    switch (nextStep) {
      case 'change active project':
        break
      case 'create another project':
        break
      case 'show active project':
        break
      case "show project's details":
        break
      case 'logut':
        this.logout(nextStep)
        break
      default:
        process.exit(0)
    }
  }

  private async getSchemamenu(userEmail: string, projectId: string) {
    CliUx.ux.info(
      wizardStatusMessage(
        wizardStatus({
          messages: defaultWizardMessages,
          breadcrumbs: this.breadcrumbs,
          userEmail,
          projectId,
        }),
      ),
    )
    const nextStep = await selectNextStep(wizardMap.get(WizardMenus.SCHEMA_MENU))
    switch (nextStep) {
      case 'show schemas':
        break
      case 'show schema details':
        break
      case 'create schema':
        break
      case 'logut':
        this.logout(nextStep)
        break
      default:
        process.exit(0)
    }
  }

  public async logout(nextStep: string) {
    await Logout.run([])
    this.breadcrumbs.push(nextStep)
  }
}
