import { MessageBlock } from '../render/functions'
import { projectSummary } from './mock-projects'

export const unAuthNoProjMessage: MessageBlock[] = [
  {
    text: 'Welcome to the Affinidi Wizard',
    styled: 'Welcome to the Affinidi Wizard',
  },
  {
    text: 'You are not authenticated yet.',
    styled: 'You are not authenticated yet.',
  },
  {
    text: 'Active project: no active projects',
    styled: 'Active project: no active projects',
  },
]
export const testUserEmail = 'test@email.com'
export const authNoProjMessage: MessageBlock[] = [
  {
    text: 'Welcome to the Affinidi Wizard',
    styled: 'Welcome to the Affinidi Wizard',
  },
  {
    text: `You are authenticated as: ${testUserEmail}`,
    styled: `You are authenticated as: ${testUserEmail}`,
  },
  {
    text: 'Active project: no active projects',
    styled: 'Active project: no active projects',
  },
]

export const authProjMessage: MessageBlock[] = [
  {
    text: 'Welcome to the Affinidi Wizard',
    styled: 'Welcome to the Affinidi Wizard',
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
    text: 'Welcome to the Affinidi Wizard',
    styled: 'Welcome to the Affinidi Wizard',
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
