import { expect } from 'chai'
import { TestService } from '../../src'

describe('TestService', () => {

  const testService = new TestService()

  beforeEach(() => {
    // TODO
  })

  beforeEach(() => {
    // TODO
  })

  afterEach(() => {
    // TODO
  })

  describe('helloWorld()', () => {
    it('should return hello world message', async () => {
      expect(testService.getMessage()).to.equal("Hello world!!!")
    })
  })
})
