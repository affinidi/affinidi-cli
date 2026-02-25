import { expect } from 'chai'
import { generateDefaultTokenName } from '../../src/helpers/token.js'

describe('generateDefaultTokenName', () => {
  let originalUser: string | undefined
  let originalHostname: string | undefined

  beforeEach(() => {
    originalUser = process.env.USER
    originalHostname = process.env.HOSTNAME
  })

  afterEach(() => {
    if (originalUser === undefined) {
      delete process.env.USER
    } else {
      process.env.USER = originalUser
    }
    if (originalHostname === undefined) {
      delete process.env.HOSTNAME
    } else {
      process.env.HOSTNAME = originalHostname
    }
  })

  it('falls back to "cli" for both USER and HOSTNAME when env vars are absent', () => {
    delete process.env.USER
    delete process.env.HOSTNAME
    const result = generateDefaultTokenName()
    expect(result).to.match(/^PAT-cli@cli-\d{4}$/)
    expect(result.length).to.be.at.least(8)
  })

  it('uses USER and HOSTNAME from env when present', () => {
    process.env.USER = 'alice'
    process.env.HOSTNAME = 'mybox'
    const result = generateDefaultTokenName()
    expect(result).to.match(/^PAT-alice@mybox-\d{4}$/)
    expect(result.length).to.be.at.least(8)
  })

  it('pads result to at least 8 characters when user and hostname are very short', () => {
    process.env.USER = 'u'
    process.env.HOSTNAME = 'h'
    const result = generateDefaultTokenName()
    expect(result.length).to.be.at.least(8)
    expect(result).to.match(/^PAT-u@h-\d{4}$/)
  })

  it('falls back to "cli" when USER or HOSTNAME is an empty or whitespace-only string', () => {
    process.env.USER = '   '
    process.env.HOSTNAME = ''
    const result = generateDefaultTokenName()
    expect(result).to.match(/^PAT-cli@cli-\d{4}$/)
    expect(result.length).to.be.at.least(8)
  })
})