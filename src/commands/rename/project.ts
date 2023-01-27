import { Command, Flags, CliUx } from '@oclif/core'
import { CliError, getErrorOutput } from '../../errors'
import { ViewFormat } from '../../constants'
import { DisplayOptions, displayOutput } from '../../middleware/display'
import { NextStepsRawMessage } from '../../render/functions'
import { configService, iAmService } from '../../services'
import { getSession } from '../../services/user-management'
import { newProjectName, selectProject } from '../../user-actions'
import { checkErrorFromWizard } from '../../wizard/helpers'

export default class Project extends Command {
  static command = 'affinidi rename project'

  static description = 'Use this command to rename an existing project'

  static usage = 'rename project [projectId]'

  static examples = ['<%= config.bin %> <%= command.id %>']

  static args = [{ name: 'projectId' }]

  static flags = {
    output: Flags.enum<ViewFormat>({
      char: 'o',
      description: 'set flag to override default output format view',
      options: ['plaintext', 'json'],
    }),
    name: Flags.string({
      char: 'n',
      description: 'new name of the project',
    }),
  }

  public async run(): Promise<void> {
    const { args, flags } = await this.parse(Project)
    const {
      consoleAuthToken: token,
      account: { userId, label },
    } = getSession()
    let { projectId } = args
    let newName = flags.name

    if (!projectId) {
      CliUx.ux.action.start('Fetching projects')
      const projectData = await iAmService.listProjects(token, 0, Number.MAX_SAFE_INTEGER)
      if (projectData.length === 0) {
        CliUx.ux.action.stop('No Projects were found')
        displayOutput({ itemToDisplay: NextStepsRawMessage, flag: flags.output })
        return
      }
      CliUx.ux.action.stop('List of projects: ')
      const maxNameLength = projectData
        .map((p) => p.name.length)
        .reduce((p, c) => Math.max(p, c), 0)

      projectId = await selectProject(projectData, maxNameLength)
    }
    if (!newName) {
      newName = await newProjectName()
    }
    await iAmService.renameProject(projectId, newName, token)
    const renamedProjectSumamry = await iAmService.getProjectSummary(token, projectId)
    const test = process.env.NODE_ENV === 'test'
    if (renamedProjectSumamry.apiKey?.apiKeyHash && !test) {
      renamedProjectSumamry.apiKey.apiKeyHash = ''.padEnd(
        renamedProjectSumamry.apiKey.apiKeyHash?.length,
        '*',
      )
    }
    if (renamedProjectSumamry.wallet?.didUrl && !test) {
      renamedProjectSumamry.wallet.didUrl = ''.padEnd(
        renamedProjectSumamry.wallet.didUrl?.length,
        '*',
      )
    }
    displayOutput({
      itemToDisplay: JSON.stringify(renamedProjectSumamry, null, '  '),
      flag: flags.output,
    })
  }

  async catch(error: CliError) {
    if (checkErrorFromWizard(error)) throw error
    CliUx.ux.action.stop('failed')
    const outputFormat = configService.getOutputFormat()
    const optionsDisplay: DisplayOptions = {
      itemToDisplay: getErrorOutput(
        error,
        Project.command,
        Project.usage,
        Project.description,
        outputFormat !== 'plaintext',
      ),
      err: true,
    }
    try {
      const { flags } = await this.parse(Project)
      optionsDisplay.flag = flags.output
      displayOutput(optionsDisplay)
    } catch (_) {
      displayOutput(optionsDisplay)
    }
  }
}
