import { MessageBlock } from '../render/functions'
import { noActiveProject, notAuthenticated, welcomeWizard } from '../render/texts'
import { projectSummary } from './mock-projects'

export const unAuthNoProjMessage: MessageBlock[] = [
  {
    text: welcomeWizard,
    styled: welcomeWizard,
  },
  {
    text: notAuthenticated,
    styled: notAuthenticated,
  },
  {
    text: noActiveProject,
    styled: noActiveProject,
  },
  {
    text: '',
    styled: '',
  },
]
export const testUserEmail = 'test@email.com'
export const authNoProjMessage: MessageBlock[] = [
  {
    text: welcomeWizard,
    styled: welcomeWizard,
  },
  {
    text: `You are authenticated as: ${testUserEmail}`,
    styled: `You are authenticated as: ${testUserEmail}`,
  },
  {
    text: noActiveProject,
    styled: noActiveProject,
  },
  {
    text: '',
    styled: '',
  },
]

export const authProjMessage: MessageBlock[] = [
  {
    text: welcomeWizard,
    styled: welcomeWizard,
  },
  {
    text: `You are authenticated as: ${testUserEmail}`,
    styled: `You are authenticated as: ${testUserEmail}`,
  },
  {
    text: `Active project ID: ${projectSummary.project.projectId}`,
    styled: `Active project ID: ${projectSummary.project.projectId}`,
  },
  {
    text: `Active project name: ${projectSummary.project.name}`,
    styled: `Active project name: ${projectSummary.project.name}`,
  },
]

export const breadcrumbs: string[] = [
  'project management',
  'creating a new project',
  'generate an application',
]

export const authProjBCMessage: MessageBlock[] = [
  {
    text: welcomeWizard,
    styled: welcomeWizard,
  },
  {
    text: `You are authenticated as: ${testUserEmail}`,
    styled: `You are authenticated as: ${testUserEmail}`,
  },
  {
    text: `Active project ID: ${projectSummary.project.projectId}`,
    styled: `Active project ID: ${projectSummary.project.projectId}`,
  },
  {
    text: `Active project name: ${projectSummary.project.name}`,
    styled: `Active project name: ${projectSummary.project.name}`,
  },
  {
    text: breadcrumbs.join(' > '),
    styled: breadcrumbs.join(' > '),
  },
]
