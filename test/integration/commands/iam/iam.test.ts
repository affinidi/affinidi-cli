import { test, expect } from '@oclif/test'
import { data } from './data'

describe('iam add-principal', () => {
  const validArgs = [
    'iam add-principal',
    `--principal-id=${data.principalId}`,
    `--principal-type=${data.principalType}`,
  ]

  test.command(validArgs).it('outputs a principal (user or token) to the active project')
})

describe('iam list-principals', () => {
  const validArgs = ['iam list-principals']

  test.command(validArgs).it('outputs the principals (users and tokens) in the active project', async (ctx: any) => {
    const response = ctx.returned
    expect(response).to.have.a.property('records')
    expect(response?.records).to.be.instanceOf(Array)
    expect(response?.records).to.have.length.greaterThanOrEqual(1)

    const generatedPrincipalId = `${data.principalType}/${data.principalId}`
    let foundRecord = false

    for (const record of response.records) {
      expect(record).to.have.a.property('projectId')
      expect(record).to.have.a.property('projectName')
      expect(record).to.have.a.property('principalId')
      expect(record).to.have.a.property('version')
      expect(record).to.have.a.property('statement')
      if (record?.principalId === generatedPrincipalId) foundRecord = true
    }

    expect(foundRecord).to.be.equal(true)
  })
})

describe('iam get-policies', () => {
  const validArgs = ['iam get-policies', `--principal-id=${data.principalId}`, `--principal-type=${data.principalType}`]

  test.command(validArgs).it('outputs the policies of a principal (user or token)', async (ctx: any) => {
    const response = ctx.returned
    expect(response).to.have.a.property('version')
    expect(response).to.have.a.property('statement')
    expect(response?.statement).to.be.instanceOf(Array)
  })
})

describe('iam remove-principal', () => {
  const validArgs = [
    'iam remove-principal',
    `--principal-id=${data.principalId}`,
    `--principal-type=${data.principalType}`,
  ]

  test.command(validArgs).it('outputs the deleted group name', async (ctx: any) => {
    const response = ctx.returned

    expect(response).to.have.a.property('principal-id')
    expect(response).to.have.a.property('principal-type')
    expect(response['principal-id']).to.be.equal(data.principalId)
    expect(response['principal-type']).to.be.equal(data.principalType)
  })
})
