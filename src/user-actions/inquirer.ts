import * as inquirer from 'inquirer'
import { ProjectDto } from '../services/iam/iam.api'

export const selectProject = async (
  projectData: ProjectDto[],
  maxNameLength: number,
): Promise<string> => {
  return inquirer
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
    .then((answer) => {
      return answer.projectId.split(' ')[0]
    })
}
