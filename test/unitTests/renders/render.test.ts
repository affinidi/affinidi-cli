import { expect } from 'chai'
import { defaultWizardMessages, MessageBlock, wizardStatus } from '../../../src/render/functions'
import { projectSummary } from '../../../src/fixtures/mock-projects'
import {
  authNoProjMessage,
  authProjBCMessage,
  authProjMessage,
  breadcrumbs,
  testUserEmail,
  unAuthNoProjMessage,
} from '../../../src/fixtures/mock-status'

const toString = (messages: MessageBlock[]): string => {
  let res: string
  messages.forEach((line) => {
    res += `${line.text}\n`
  })
  return res
}

const {
  project: { projectId, name },
} = projectSummary

describe('wizard status', () => {
  describe('status unauth and no project', () => {
    it('should wizard status when not authenticated and no active project', () => {
      const result = wizardStatus({
        messages: defaultWizardMessages,
        breadcrumbs: [],
      })
      expect(toString(result)).to.equal(toString(unAuthNoProjMessage))
    })
  })
  describe('status auth and no project', () => {
    it('should wizard status when authenticated and no active project', () => {
      const result = wizardStatus({
        messages: defaultWizardMessages,
        breadcrumbs: [],
        userEmail: testUserEmail,
      })
      expect(toString(result)).to.equal(toString(authNoProjMessage))
    })
  })
  describe('status auth and active project', () => {
    it('should wizard status when authenticated and active project', () => {
      const result = wizardStatus({
        messages: defaultWizardMessages,
        breadcrumbs: [],
        userEmail: testUserEmail,
        projectId,
        projectName: name,
      })
      expect(toString(result)).to.equal(toString(authProjMessage))
    })
  })
  describe('status auth, active project and breadCrumbs', () => {
    it('should wizard status when authenticated and active project', () => {
      const result = wizardStatus({
        messages: defaultWizardMessages,
        breadcrumbs,
        userEmail: testUserEmail,
        projectId,
        projectName: name,
      })
      expect(toString(result)).to.equal(toString(authProjBCMessage))
    })
  })
})
