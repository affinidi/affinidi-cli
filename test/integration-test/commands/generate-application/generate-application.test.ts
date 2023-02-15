import { expect, test } from '@oclif/test'
import fs from 'fs'

const ticketing = 'ticketing'
const education = 'education'
const health = 'health'
const portableReputation = 'portable-reputation'

describe('User generates application', () => {
  after(() => {
    fs.rmSync(`./${ticketing}`, { recursive: true, force: true })
    fs.rmSync(`./${education}`, { recursive: true, force: true })
    fs.rmSync(`./${health}`, { recursive: true, force: true })
    fs.rmSync(`./${portableReputation}`, { recursive: true, force: true })
  })
  describe('Generate ticketing app', () => {
    test
      .stdout()
      .command(['generate-application', '-n', `${ticketing}`, '-u', `${ticketing}`])
      .it('generate ticketing app', () => {
        expect(fs.existsSync(`./${ticketing}`)).be.true
      })
  })
  describe('Generate education app', () => {
    test
      .stdout()
      .command(['generate-application', '-n', `${education}`, '-u', `${education}`])
      .it('generate education app', () => {
        expect(fs.existsSync(`./${education}`)).to.be.true
      })
  })
  describe('Generate health app', () => {
    test
      .stdout()
      .command(['generate-application', '-n', `${health}`, '-u', `${health}`])
      .it('generate health app', () => {
        expect(fs.existsSync(`./${health}`)).to.be.true
      })
  })
  describe('Generate portable-reputation app', () => {
    test
      .stdout()
      .command([
        'generate-application',
        '-n',
        `${portableReputation}`,
        '-u',
        `${portableReputation}`,
      ])
      .it('generate portable-reputation app', () => {
        expect(fs.existsSync(`./${portableReputation}`)).to.be.true
      })
  })
})
