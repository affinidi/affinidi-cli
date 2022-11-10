import { CliUx, Command, Flags, Interfaces } from '@oclif/core'
import * as fs from 'fs/promises'
import * as inquirer from 'inquirer'
import { ProjectSummary } from '../../services/iam/iam.api'

import { iAmService, vaultService, VAULT_KEYS } from '../../services'
import { getSession } from '../../services/user-management'

type UseFieldType = 'json' | 'json-file'

const setActiveProject = (projectToBeActive: ProjectSummary): void => {
  vaultService.set(VAULT_KEYS.projectId, projectToBeActive.project.projectId)
  vaultService.set(VAULT_KEYS.projectName, projectToBeActive.project.name)
  vaultService.set(VAULT_KEYS.projectAPIKey, projectToBeActive.apiKey.apiKeyHash)
  vaultService.set(VAULT_KEYS.projectDID, projectToBeActive.wallet.did)
}
export default class Project extends Command {
  static description = 'describe the command here'

  static examples = ['<%= config.bin %> <%= command.id %>']

  static flags = {
    output: Flags.enum<UseFieldType>({
      char: 'o',
      options: ['json', 'json-file'],
      description: 'The details of the schema to show',
      default: 'json',
    }),
  }

  static args: Interfaces.Arg[] = [
    {
      name: 'project-id',
      description: 'id of the project to use',
    },
  ]

  public async run(): Promise<void> {
    const { args, flags } = await this.parse(Project)

    let projectId = args['project-id']
    const token = getSession()?.accessToken

    if (!projectId) {
      CliUx.ux.action.start('Fetching projects')
      const projectData = await iAmService.listProjects(token, 0, Number.MAX_SAFE_INTEGER)
      CliUx.ux.action.stop('List of projects: ')
      const maxNameLength = projectData
        .map((p) => p.name.length)
        .reduce((p, c) => Math.max(p, c), 0)
      await inquirer
        .prompt([
          {
            type: 'list',
            name: 'projectId',
            message: 'select a project',
            choices: projectData.map((data) => ({
              name: `${data.projectId} ${data.name.padEnd(maxNameLength)} ${data.createdAt}`,
            })),
          },
        ])
        .then(function (answer) {
          projectId = answer.projectId.split(' ')[0]
        })
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

  async catch(error: string | Error) {
    CliUx.ux.info(error.toString())
  }
}
