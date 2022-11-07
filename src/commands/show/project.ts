import { CliUx, Command, Flags, Interfaces } from '@oclif/core'
import * as fs from 'fs/promises'
import * as inquirer from 'inquirer'

import { iAmService, vaultService, VAULT_KEYS } from '../../services'

type UseFieldType = 'json' | 'json-file'

export default class ShowProject extends Command {
  static description = 'describe the command here'

  static examples = ['<%= config.bin %> <%= command.id %>']

  static flags = {
    output: Flags.enum<UseFieldType>({
      char: 'o',
      options: ['json', 'json-file'],
      description: 'The details of the schema to show',
      default: 'json',
    }),
    active: Flags.boolean({
      char: 'a',
    }),
  }

  static args: Interfaces.Arg[] = [
    {
      name: 'project-id',
      description: 'id of the project to use',
    },
  ]

  public async run(): Promise<void> {
    const { args, flags } = await this.parse(ShowProject)

    const token = vaultService.get(VAULT_KEYS.sessionToken)
    let projectId = args['project-id']

    if (flags.active) {
      projectId = vaultService.get(VAULT_KEYS.projectId)
      CliUx.ux.action.start('Showing active project')
    } else if (projectId) {
      CliUx.ux.action.start(`Showing project with id: ${projectId}`)
    } else {
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
      CliUx.ux.action.start(`Showing project with id: ${projectId}`)
    }

    CliUx.ux.action.stop('')
    const projectData = await iAmService.getProjectSummary(token, projectId)
    if (flags.output === 'json-file') {
      await fs.writeFile('projects.json', JSON.stringify(projectData, null, '  '))
    } else {
      CliUx.ux.info(JSON.stringify(projectData, null, '  '))
    }
  }

  async catch(error: string | Error) {
    CliUx.ux.info(error.toString())
  }
}
