import { expect } from 'chai'
import { authErrorMessage } from '../../src/services/affinidi/auth/auth-error-message.js'

describe('authErrorMessage', () => {
  it('tells the user to accept the terms after declining them', () => {
    expect(authErrorMessage('access_denied', 'terms_declined')).to.equal(
      `You must accept the Terms and Conditions to use Affinidi CLI. Run 'affinidi start' to try again.`,
    )
  })

  it('explains a declined data access request', () => {
    expect(authErrorMessage('access_denied', 'request_declined')).to.contain('You have declined access to your data.')
  })

  it('reports any other access denial as such', () => {
    expect(authErrorMessage('access_denied')).to.equal('Access denied.')
  })

  it('falls back to a generic message for other errors', () => {
    expect(authErrorMessage('access')).to.equal('Unexpected error occurred')
    expect(authErrorMessage()).to.equal('Unexpected error occurred')
  })
})
