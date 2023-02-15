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
    fs.rmSync(`./default`, { recursive: true, force: true })
    fs.rmSync(`./my-app`, { recursive: true, force: true })
  })
  describe('Generate ticketing app', () => {
    test
      .stdout()
      .command(['generate-application', '-n', `${ticketing}`, '-u', `${ticketing}`])
      .it('generate ticketing app', async () => {
        expect(fs.existsSync(`./${ticketing}`)).be.true
        const packageJSON = await fs.readFileSync(`./${ticketing}/package.json`, 'utf-8')
        const packageJSONObject = JSON.parse(packageJSON)
        expect(packageJSONObject.name).to.equal(`reference-app-${ticketing}`)
      })
  })
  describe('Generate education app', () => {
    test
      .stdout()
      .command(['generate-application', '-n', `${education}`, '-u', `${education}`])
      .it('generate education app', async () => {
        expect(fs.existsSync(`./${education}`)).to.be.true
        const packageJSON = await fs.readFileSync(`./${education}/package.json`, 'utf-8')
        const packageJSONObject = JSON.parse(packageJSON)
        expect(packageJSONObject.name).to.equal(`reference-app-${education}`)
      })
  })
  describe('Generate health app', () => {
    test
      .stdout()
      .command(['generate-application', '-n', `${health}`, '-u', `${health}`])
      .it('generate health app', async () => {
        expect(fs.existsSync(`./${health}`)).to.be.true
        const packageJSON = await fs.readFileSync(`./${health}/package.json`, 'utf-8')
        const packageJSONObject = JSON.parse(packageJSON)
        expect(packageJSONObject.name).to.equal(`${health}`)
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
      .it('generate portable-reputation app', async () => {
        expect(fs.existsSync(`./${portableReputation}`)).to.be.true
        const packageJSON = await fs.readFileSync(`./${portableReputation}/package.json`, 'utf-8')
        const packageJSONObject = JSON.parse(packageJSON)
        expect(packageJSONObject.name).to.equal(`developer-reputation-app`)
      })
  })
  describe('Generate default app', () => {
    test
      .stdout()
      .command(['generate-application', '-n', `default`])
      .it('generate default app', async () => {
        expect(fs.existsSync(`./default`)).to.be.true
        const packageJSON = await fs.readFileSync(`./default/package.json`, 'utf-8')
        const packageJSONObject = JSON.parse(packageJSON)
        expect(packageJSONObject.name).to.equal(`reference-app-${ticketing}`)
      })
  })
  describe('Generate default app with default name', () => {
    test
      .stdout()
      .command(['generate-application'])
      .it('generate default app with default name', async () => {
        expect(fs.existsSync(`./my-app`)).to.be.true
        const packageJSON = await fs.readFileSync(`./my-app/package.json`, 'utf-8')
        const packageJSONObject = JSON.parse(packageJSON)
        expect(packageJSONObject.name).to.equal(`reference-app-${ticketing}`)
      })
  })
})
