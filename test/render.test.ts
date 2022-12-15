import { expect } from 'chai'
import { MessageBlock, wizardStatus } from '../src/render/functions'
import { projectSummary } from '../src/fixtures/mock-projects'

const unAuthNoProjMessage: MessageBlock[] = [
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
const testUserEmail = 'test@email.com'
const breadcrumbs: string[] = [
  'project management',
  'creating a new project',
  'generate an application',
]
const authNoProjMessage: MessageBlock[] = [
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
const authProjMessage: MessageBlock[] = [
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
const authProjBCMessage: MessageBlock[] = [
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
const toString = (messages: MessageBlock[]): string => {
  let res: string
  messages.forEach((line) => {
    res += `${line.text}\n`
  })
  return res
}

describe.only('wizard status', () => {
  describe('status unauth and no project', () => {
    it('should wizard status when not authenticated and no active project', () => {
      const result = wizardStatus([])
      expect(toString(result)).to.equal(toString(unAuthNoProjMessage))
    })
  })
  describe('status auth and no project', () => {
    it('should wizard status when authenticated and no active project', () => {
      const result = wizardStatus([], testUserEmail)
      expect(toString(result)).to.equal(toString(authNoProjMessage))
    })
  })
  describe('status auth and active project', () => {
    it('should wizard status when authenticated and active project', () => {
      const result = wizardStatus([], testUserEmail, projectSummary)
      expect(toString(result)).to.equal(toString(authProjMessage))
    })
  })
  describe('status auth, active project and breadCrumbs', () => {
    it('should wizard status when authenticated and active project', () => {
      const result = wizardStatus(breadcrumbs, testUserEmail, projectSummary)
      expect(toString(result)).to.equal(toString(authProjBCMessage))
    })
  })
})
