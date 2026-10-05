import { expect } from 'chai'
import { LoginAuthMethods } from '../../src/common/constants.js'
import { applyAuthMethod } from '../../src/services/affinidi/auth/auth-url.js'

const AUTH_URL = new URL('https://auth.example.com/oauth2/auth?state=abc&prompt=login')

describe('applyAuthMethod', () => {
  it('sets auth_method on the auth url', () => {
    const url = applyAuthMethod(AUTH_URL, LoginAuthMethods.OTC)

    expect(url.searchParams.get('auth_method')).to.equal('otc')
    expect(url.searchParams.get('state')).to.equal('abc')
    expect(url.searchParams.get('prompt')).to.equal('login')
  })

  it('leaves the auth url unchanged without an auth method', () => {
    const url = applyAuthMethod(AUTH_URL)

    expect(url.href).to.equal(AUTH_URL.href)
  })
})
