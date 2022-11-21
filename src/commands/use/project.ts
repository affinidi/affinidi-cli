import { CliUx, Command, Flags, Interfaces } from '@oclif/core'
import * as fs from 'fs/promises'
import { ProjectSummary } from '../../services/iam/iam.api'

import { iAmService, vaultService, VAULT_KEYS } from '../../services'
import { getSession } from '../../services/user-management'
import { getErrorOutput, CliError } from '../../errors'
import { selectProject } from '../../user-actions'
import { NextStepsRawMessage } from '../../render/functions'

type UseFieldType = 'json' | 'json-file'

const setActiveProject = (projectToBeActive: ProjectSummary): void => {
  vaultService.set(VAULT_KEYS.projectId, projectToBeActive.project.projectId)
  vaultService.set(VAULT_KEYS.projectName, projectToBeActive.project.name)
  vaultService.set(VAULT_KEYS.projectAPIKey, projectToBeActive.apiKey.apiKeyHash)
  vaultService.set(VAULT_KEYS.projectDID, projectToBeActive.wallet.did)
}
export default class Project extends Command {
  static command = 'affinidi use'

  static description = 'Defines the project you want to work with.'

  static usage = 'use project [project-id] [FLAGS]'

  static examples = ['<%= config.bin %> <%= command.id %>']

  static flags = {
    output: Flags.enum<UseFieldType>({
      char: 'o',
      options: ['json', 'json-file'],
      description: 'print details of the project to use as JSON',
      default: 'json',
    }),
  }

  static args: Interfaces.Arg[] = [
    {
      name: 'project-id',
      description: 'the ID of the project to use',
    },
  ]

  public async run(): Promise<void> {
    const { args, flags } = await this.parse(Project)

    let projectId = args['project-id']
    const token = getSession()?.accessToken

    if (!projectId) {
      CliUx.ux.action.start('Fetching projects')
      const projectData = await iAmService.listProjects(token, 0, Number.MAX_SAFE_INTEGER)
      if (projectData.length === 0) {
        CliUx.ux.action.stop('No Projects were found')
        CliUx.ux.info(NextStepsRawMessage)
        return
      }
      CliUx.ux.action.stop('List of projects: ')
      const maxNameLength = projectData
        .map((p) => p.name.length)
        .reduce((p, c) => Math.max(p, c), 0)

      projectId = await selectProject(projectData, maxNameLength)
    }
    const projectToBeActive = await iAmService.getProjectSummary(token, projectId)
    if (flags.output === 'json-file') {
      await fs.writeFile('projects.json', JSON.stringify(projectToBeActive, null, '  '))
    }
    setActiveProject(projectToBeActive)
    if (projectToBeActive.apiKey?.apiKeyHash) {
      projectToBeActive.apiKey.apiKeyHash = ''.padEnd(
        projectToBeActive.apiKey.apiKeyHash?.length,
        '*',
      )
    }
    if (projectToBeActive.wallet?.didUrl) {
      projectToBeActive.wallet.didUrl = ''.padEnd(projectToBeActive.wallet.didUrl?.length, '*')
    }

    CliUx.ux.info(JSON.stringify(projectToBeActive, null, '  '))
  }

  async catch(error: CliError) {
    CliUx.ux.action.stop('failed')
    CliUx.ux.info(getErrorOutput(error, Project.command, Project.usage, Project.description))
  }
}
