import { expect } from 'chai'
import { split } from '../../src/common/validators'

describe('split', () => {
  it('should return a non-empty array with elements excluding delimiter', () => {
    const str = 'apple,banana,,orange,',
      delimiter = ','
    const expectedOutput = ['apple', 'banana', 'orange']

    const result = split(str, delimiter)

    expect(result).to.deep.equal(expectedOutput)
  })

  it('should return an empty array if the input string is empty', () => {
    const str = '',
      delimiter = ','
    const expectedOutput: string[] = []

    const result = split(str, delimiter)

    expect(result).to.deep.equal(expectedOutput)
  })

  it('should return an empty array if no character apart from delimiter is present', () => {
    const str = ',,,',
      delimiter = ','
    const expectedOutput: string[] = []

    const result = split(str, delimiter)

    expect(result).to.deep.equal(expectedOutput)
  })

  it('should handle different delimiter', () => {
    const str = 'apple;banana;;orange;',
      delimiter = ';'
    const expectedOutput = ['apple', 'banana', 'orange']

    const result = split(str, delimiter)

    expect(result).to.deep.equal(expectedOutput)
  })
})
