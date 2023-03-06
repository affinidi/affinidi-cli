import { CliUx, Command, Flags } from '@oclif/core'

import { wizardStatusMessage, wizardStatus, defaultWizardMessages } from '../render/functions'
import { isTokenValid } from '../middleware/authentication'
import {
  chooseUseCase,
  confirmConfigCustomWallet,
  schemaPublicPrivate,
  selectNextStep,
} from '../user-actions/inquirer'
import Login from './login'
import SignUp from './sign-up'
import { getSession } from '../services/user-management'
import { iAmService } from '../services'
import { vaultService } from '../services/vault/typedVaultService'
import CreateProject from './create/project'
import Logout from './logout'
import ShowProject from './show/project'
import UseProject from './use/project'
import { CliError, getErrorOutput } from '../errors'
import { displayOutput } from '../middleware/display'
import {
  backToMainMenu,
  backToProjectMenu,
  backToSchemaMenu,
  bulkIssuance,
  changeActiveProject,
  chooseSchemaFromList,
  createProject,
  createSchema,
  generateApplication,
  genNewApp,
  issueNewVc,
  issueVC,
  issueVcFromSchemaMenu,
  logout,
  manageProjects,
  manageSchemas,
  showActiveProject,
  showDetailedProject,
  showDetailedSchema,
  showSchemas,
  singleIssuance,
  typeSchemaId,
  typeSchemaUrl,
  verifyNewVc,
  verifyVC,
  wizardMap,
  WizardMenus,
} from '../constants'
import ShowSchema from './show/schema'
import CreateSchema from './create/schema'
import {
  schemaDescription,
  schemaId,
  schemaJSONFilePath,
  applicationName,
  pathToCSV,
  pathToVc,
  schemaUrl,
  walletUrl,
  credentialSubjectJSONFilePath,
} from '../user-actions'
import VerifyVc from './verify-vc'
import GenerateApplication from './generate-application'
import IssueVc from './issue-vc'
import {
  chooseSchemaId,
  chooseSchemaUrl,
  getSchemaUrl,
  nextFuncAfterError,
} from '../wizard/helpers'
import { UseCasesAppNames } from '../exposedFunctions/genApp'

export default class Start extends Command {
  static description =
    'Use this command to guide you through a series of prompts to perform different commands in the CLI'

  static command = 'affinidi start'

  static usage = 'start'

  static examples = ['<%= config.bin %> <%= command.id %>']

  static flags = {
    error: Flags.boolean({
      char: 'e',
      description: '',
      default: false,
      hidden: true,
    }),
  }

  breadcrumbs: string[] = []

  menuMap = new Map<WizardMenus, () => void>([
    [WizardMenus.AUTH_MENU, this.getAuthMenu],
    [WizardMenus.MAIN_MENU, this.getMainMenu],
    [WizardMenus.PROJECT_MENU, this.getProjectMenu],
    [WizardMenus.SCHEMA_MENU, this.getSchemaMenu],
    [WizardMenus.GO_BACK_PROJECT_MENU, this.getGoBackProjectMenu],
    [WizardMenus.GO_BACK_TO_GEN_APP, this.getGoBackGenApplication],
    [WizardMenus.GO_BACK_SCHEMA_MENU, this.getGoBackSchemaMenu],
    [WizardMenus.SHOW_DETAILED_SCHEMA_MENU, this.showDetailedSchemaMenu],
    [WizardMenus.GO_BACK_TO_VERIFICATION, this.getGoBackVerifyVc],
  ])

  public async run(): Promise<void> {
    const { flags } = await this.parse(Start)
    if (flags.error) {
      await nextFuncAfterError.pop().bind(this)()
    }

    if (!(await isTokenValid())) {
      await this.getAuthMenu()
    }
    const { consoleAuthToken: token } = getSession()
    const projects = await iAmService.listProjects(token, 0, 10)

    if (projects.length === 0) {
      await this.createProject()
    }

    await this.getMainMenu()
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
        nextFuncAfterError.push(this.menuMap.get(key))
      }
    })
    await Start.run([`-e`])
  }

  private async getAuthMenu() {
    CliUx.ux.info(
      wizardStatusMessage(
        wizardStatus({ messages: defaultWizardMessages, breadcrumbs: this.breadcrumbs }),
      ),
    )
    const nextStep = await selectNextStep(wizardMap.get(WizardMenus.AUTH_MENU))
    switch (nextStep) {
      case 'login':
        this.breadcrumbs.push(nextStep)
        await Login.run(['-o', 'plaintext', '-w'])
        break
      case 'sign-up':
        this.breadcrumbs.push(nextStep)
        await SignUp.run([])
        break
      default:
        process.exit(0)
    }
  }

  private async getMainMenu() {
    CliUx.ux.info(this.getStatus())
    const nextStep = await selectNextStep(wizardMap.get(WizardMenus.MAIN_MENU))
    switch (nextStep) {
      case manageProjects:
        this.breadcrumbs.push(nextStep)
        await this.getProjectMenu()
        break
      case manageSchemas:
        this.breadcrumbs.push(nextStep)
        await this.getSchemaMenu()
        break
      case generateApplication:
        this.breadcrumbs.push(nextStep)
        await this.generateApplication()
        await this.getGoBackGenApplication()
        break
      case issueVC:
        this.breadcrumbs.push(nextStep)
        await this.issuanceSchemaMenu()
        break
      case verifyVC:
        this.breadcrumbs.push(nextStep)
        await this.verifyVc()
        break
      case logout:
        this.logout(nextStep)
        break
      default:
        process.exit(0)
    }
  }

  // Project Management
  private async getProjectMenu() {
    CliUx.ux.info(this.getStatus())
    const nextStep = await selectNextStep(wizardMap.get(WizardMenus.PROJECT_MENU))
    switch (nextStep) {
      case changeActiveProject:
        this.breadcrumbs.push(nextStep)
        await this.useProject()
        await this.getGoBackProjectMenu()
        break
      case createProject:
        await this.createProject()
        await this.getGoBackProjectMenu()
        break
      case showActiveProject:
        this.breadcrumbs.push(nextStep)
        await this.showProject(true)
        await this.getGoBackProjectMenu()
        break
      case showDetailedProject:
        this.breadcrumbs.push(nextStep)
        await this.showProject(false)
        await this.getGoBackProjectMenu()
        break
      case backToMainMenu:
        await this.getMainMenu()
        break
      case logout:
        this.logout(nextStep)
        break
      default:
        process.exit(0)
    }
  }

  private async getGoBackProjectMenu() {
    CliUx.ux.info(this.getStatus())

    const nextStep = await selectNextStep(wizardMap.get(WizardMenus.GO_BACK_PROJECT_MENU))
    switch (nextStep) {
      case backToProjectMenu:
        await this.getProjectMenu()
        break
      case backToMainMenu:
        await this.getMainMenu()
        break
      default:
        process.exit(0)
    }
  }

  private async createProject() {
    const {
      account: { label: userEmail },
    } = getSession()
    CliUx.ux.info(
      wizardStatusMessage(
        wizardStatus({
          messages: defaultWizardMessages,
          breadcrumbs: this.breadcrumbs,
          userEmail,
        }),
      ),
    )
    this.breadcrumbs.push('create a project')
    await CreateProject.run(['-o', 'plaintext'])
  }

  private async useProject() {
    CliUx.ux.info(this.getStatus())
    await UseProject.run(['-o', 'plaintext'])
  }

  private async showProject(active: boolean) {
    CliUx.ux.info(this.getStatus())
    if (active) {
      await ShowProject.run(['-a', '-o', 'plaintext'])
      return
    }
    await ShowProject.run(['-o', 'plaintext'])
  }

  // Schema Management
  private async getSchemaMenu() {
    CliUx.ux.info(this.getStatus())
    const nextStep = await selectNextStep(wizardMap.get(WizardMenus.SCHEMA_MENU))
    switch (nextStep) {
      case showSchemas:
        this.breadcrumbs.push(showDetailedSchema)
        await this.listSchemas()
        break
      case showDetailedSchema:
        this.breadcrumbs.push(nextStep)
        await this.showDetailedSchemaMenu()
        break
      case createSchema:
        await this.createSchema()
        break
      case backToMainMenu:
        await this.getMainMenu()
        break
      case logout:
        this.logout(nextStep)
        break
      default:
        process.exit(0)
    }
  }

  private async listSchemas() {
    CliUx.ux.info(this.getStatus())
    this.breadcrumbs.push(showSchemas)
    const chosenSchemaId = await chooseSchemaId(0)
    await ShowSchema.run([`${chosenSchemaId}`])
    await this.getGoBackSchemaMenu(chosenSchemaId)
  }

  private async showSchema() {
    CliUx.ux.info(this.getStatus())
    const chosenSchemaId = await schemaId()
    await ShowSchema.run([`${chosenSchemaId}`])
    await this.getGoBackSchemaMenu(chosenSchemaId)
  }

  private async createSchema() {
    CliUx.ux.info(this.getStatus())
    this.breadcrumbs.push(createSchema)
    const createdSchemaId = await CreateSchema.run([
      '-s',
      `${await schemaJSONFilePath()}`,
      `-p`,
      `${await schemaPublicPrivate()}`,
      '-d',
      `${await schemaDescription()}`,
    ])
    await this.getGoBackSchemaMenu(createdSchemaId)
  }

  private async showDetailedSchemaMenu() {
    CliUx.ux.info(this.getStatus())

    const nextStep = await selectNextStep(wizardMap.get(WizardMenus.SHOW_DETAILED_SCHEMA_MENU))
    switch (nextStep) {
      case chooseSchemaFromList:
        this.breadcrumbs.push(showDetailedSchema)
        await this.listSchemas()

        break
      case typeSchemaId:
        this.breadcrumbs.push(showDetailedSchema)
        await this.showSchema()
        break
      default:
        process.exit(0)
    }
  }

  private async getGoBackSchemaMenu(chosenSchemaId?: string) {
    CliUx.ux.info(this.getStatus())
    const chosenSchemaUrl = await getSchemaUrl(chosenSchemaId)
    const nextStep = await selectNextStep(wizardMap.get(WizardMenus.GO_BACK_SCHEMA_MENU))
    switch (nextStep) {
      case issueVcFromSchemaMenu:
        await this.issuanceTypeMenu(chosenSchemaUrl)
        break
      case backToSchemaMenu:
        await this.getSchemaMenu()
        break
      case backToMainMenu:
        await this.getMainMenu()
        break
      default:
        process.exit(0)
        break
    }
  }

  // Generate Application
  private async getGoBackGenApplication() {
    const nextStep = await selectNextStep(wizardMap.get(WizardMenus.GO_BACK_TO_GEN_APP))
    switch (nextStep) {
      case genNewApp:
        this.breadcrumbs.push(generateApplication)
        await this.generateApplication()
        await this.getGoBackGenApplication()
        break
      case backToMainMenu:
        await this.getMainMenu()
        break
      default:
        process.exit(0)
        break
    }
  }

  private async generateApplication() {
    CliUx.ux.info(this.getStatus())
    const appName = await applicationName()
    const useCase = await chooseUseCase([
      UseCasesAppNames.gamingReferenceApp,
      UseCasesAppNames.careerReferenceApp,
      UseCasesAppNames.educationReferenceApp,
      UseCasesAppNames.ticketingReferenceApp,
      UseCasesAppNames.healthReferenceApp,
    ])
    const flags = ['-n', appName, '-o', 'plaintext', '-u', `${useCase}`]
    await GenerateApplication.run(flags)
  }

  // VC issuance
  private async issuanceSchemaMenu() {
    CliUx.ux.info(this.getStatus())
    const nextStep = await selectNextStep(wizardMap.get(WizardMenus.ISSUANCE_SCHEMA_MENU))
    switch (nextStep) {
      case chooseSchemaFromList:
        await this.issuanceTypeMenu(await chooseSchemaUrl(0))
        break
      case typeSchemaUrl:
        await this.issuanceTypeMenu(await schemaUrl())
        break
      default:
        process.exit(0)
        break
    }
  }

  private async getGoBackIssueVc() {
    CliUx.ux.info(this.getStatus())
    const nextStep = await selectNextStep(wizardMap.get(WizardMenus.GO_BACK_TO_ISSUANCE))
    switch (nextStep) {
      case issueNewVc:
        await this.issuanceSchemaMenu()
        break
      case backToMainMenu:
        await this.getMainMenu()
        break
      default:
        process.exit(0)
        break
    }
  }

  private async issuanceTypeMenu(schemaInputUrl: string) {
    CliUx.ux.info(this.getStatus())
    const nextStep = await selectNextStep(wizardMap.get(WizardMenus.ISSUANCE_TYPE_MENU))
    switch (nextStep) {
      case bulkIssuance:
        await this.issueVc(true, schemaInputUrl)
        await this.getGoBackIssueVc()
        break
      case singleIssuance:
        await this.issueVc(false, schemaInputUrl)
        await this.getGoBackIssueVc()
        break
      default:
        process.exit(0)
        break
    }
  }

  private async issueVc(bulk: boolean, schemaInputUrl: string) {
    let walletCustomUrl: string
    const pathToFile = bulk ? await pathToCSV() : await credentialSubjectJSONFilePath()
    const confirmWallet = await confirmConfigCustomWallet()
    const flags = ['-s', `${schemaInputUrl}`, '-d', `${pathToFile}`, `-w`]
    if (confirmWallet) {
      walletCustomUrl = await walletUrl()
      flags.push(`${walletCustomUrl}`)
    } else {
      flags.pop()
    }
    if (bulk) flags.push('-b')
    await IssueVc.run(flags)
  }

  // VC Verification
  private async verifyVc() {
    const vcPath = await pathToVc()
    await VerifyVc.run([`-d`, `${vcPath}`, '-o', 'plaintext'])
    await this.getGoBackVerifyVc()
  }

  private async getGoBackVerifyVc() {
    CliUx.ux.info(this.getStatus())
    const nextStep = await selectNextStep(wizardMap.get(WizardMenus.GO_BACK_TO_VERIFICATION))
    switch (nextStep) {
      case verifyNewVc:
        await this.verifyVc()
        break
      case backToMainMenu:
        await this.getMainMenu()
        break
      default:
        process.exit(0)
        break
    }
  }

  private async logout(nextStep: string) {
    await Logout.run(['-o', 'plaintext'])
    this.breadcrumbs.push(nextStep)
  }

  private getStatus(): string {
    const {
      account: { label: userEmail },
    } = getSession()
    const {
      project: { projectId, name },
    } = vaultService.getActiveProject()
    const status = wizardStatusMessage(
      wizardStatus({
        messages: defaultWizardMessages,
        breadcrumbs: this.breadcrumbs,
        userEmail,
        projectId,
        projectName: name,
      }),
    )
    return `\n${status}\n`
  }
}
