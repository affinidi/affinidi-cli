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
    text: `Active project: ${projectSummary.project.projectId}`,
    styled: `Active project: ${projectSummary.project.projectId}`,
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
    text: `Active project: ${projectSummary.project.projectId}`,
    styled: `Active project: ${projectSummary.project.projectId}`,
  },
  {
    text: breadcrumbs.join(' > '),
    styled: breadcrumbs.join(' > '),
  },
]
