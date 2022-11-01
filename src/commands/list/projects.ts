import { Command, CliUx, Flags } from '@oclif/core'
import * as fs from 'fs/promises'
import { stringify as csv_stringify } from 'csv-stringify'

import { SESSION_TOKEN_KEY_NAME, iAmService, vaultService } from '../../services'

type ListProjectsOutputType = 'json' | 'table' | 'json-file' | 'csv-file'

export default class Projects extends Command {
  public static enableJsonFlag = true

  static description = 'Perform the action of listing all the projects you created'

  static examples = [
    '<%= config.bin %> <%= command.id %>',
    '<%= config.bin %> <%= command.id %> --skip=2 --limit=5 --output=csv-file',
  ]

  static flags = {
    skip: Flags.integer({
      char: 's',
      description: 'Index into projects list from which to start the listing',
      default: 0,
    }),
    limit: Flags.integer({
      char: 'l',
      description: 'Maximum number of projects which will be listed',
      default: 10,
    }),
    output: Flags.enum<ListProjectsOutputType>({
      char: 'o',
      description: 'Project listing output format',
      default: 'json',
      options: ['json', 'table', 'json-file', 'csv-file'],
    }),
  }

  public async run(): Promise<void> {
    const { flags } = await this.parse(Projects)

    const token = vaultService.get(SESSION_TOKEN_KEY_NAME)

    CliUx.ux.action.start('Fetching list of projects')
    const projectData = await iAmService.listProjects({ token }, flags.skip, flags.limit)
    CliUx.ux.action.stop()

    switch (flags.output) {
      case 'table':
        CliUx.ux.table(
          projectData.map((data) => ({
            projectId: data.projectId,
            name: data.name,
            createdAt: data.createdAt,
          })),
          { projectId: {}, name: {}, createdAt: {} },
        )
        break
      case 'json-file':
        await fs.writeFile('projects.json', JSON.stringify(projectData, null, '  '))
        break
      case 'csv-file':
        await fs.writeFile('projects.csv', csv_stringify(projectData, { header: true }))
        break
      case 'json':
        CliUx.ux.info(JSON.stringify(projectData, null, '  '))
        break
      default:
        CliUx.ux.error('Unknown output format')
        break
    }
  }
}
