import * as inquirer from 'inquirer'
import chalk from 'chalk'

import { SchemaDto } from '../services/schema-manager/schema-manager.api'
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

export const selectSchemaId = async (
  schemaData: SchemaDto[],
  maxIdLength: number,
  maxDescLength: number,
): Promise<string> => {
  return inquirer
    .prompt([
      {
        type: 'list',
        name: 'schemaId',
        message: 'select a schema',
        choices: [
          ...schemaData.map((data) => ({
            name: `${data.id.padEnd(maxIdLength)} ${(data.description
              ? data.description
              : ''
            ).padEnd(maxDescLength)} ${data.version} ${data.type}`,
            value: `${data.id}`,
          })),
          { name: chalk.greenBright('More schemas'), value: 'more' },
        ],
      },
    ])
    .then((answer) => {
      return answer.schemaId
    })
}
export const selectSchemaUrl = async (
  schemaData: SchemaDto[],
  maxIdLength: number,
  maxUrlLength: number,
): Promise<string> => {
  return inquirer
    .prompt([
      {
        type: 'list',
        name: 'schemaUrl',
        message: 'select a schema',
        choices: [
          ...schemaData.map((data) => ({
            name: `${data.jsonSchemaUrl.padEnd(maxUrlLength)} ${data.id.padEnd(maxIdLength)} ${
              data.version
            } ${data.type}`,
            value: `${data.jsonSchemaUrl}`,
          })),
          { name: chalk.greenBright('More Schemas'), value: 'more' },
        ],
      },
    ])
    .then((answer) => {
      return answer.schemaUrl
    })
}

export const schemaPublicPrivate = async (): Promise<boolean> => {
  return inquirer
    .prompt([
      {
        type: 'list',
        name: 'Schema private or unlisted',
        message: 'Do you want your schema private or unlisted',
        choices: ['public', 'unlisted'],
      },
    ])
    .then((choice) => {
      return choice === 'public'
    })
}

export const selectNextStep = async (choices: string[]): Promise<string> => {
  return inquirer
    .prompt([
      {
        type: 'list',
        name: 'NextStep',
        message: 'select your next step',
        choices,
      },
    ])
    .then((choice) => {
      return choice.NextStep
    })
}

export const confirmConfigCustomWallet = async (): Promise<string> => {
  return inquirer
    .prompt([
      {
        type: 'confirm',
        message: 'Please confirm by pressing enter if you want to configure your own wallet',
        name: 'WalletConfirmation',
      },
    ])
    .then((answer) => answer.WalletConfirmation)
}

export const chooseUseCase = async (choices: string[]): Promise<string> => {
  return inquirer
    .prompt([
      {
        type: 'list',
        name: 'refApp',
        message: 'select type of reference app',
        choices,
      },
    ])
    .then((choice) => {
      return choice.refApp
    })
}
