import { Nodepay } from './nodepay'
import { BaseGateway } from './gateways'

class MockGateway extends BaseGateway {
  protected get baseConfig(): Record<string, unknown> {
    return {}
  }

  get name(): string {
    return 'Mock gateway'
  }

  get shortName(): string {
    return 'mock'
  }
}

describe('nodepay entry', () => {
  let gateway: MockGateway

  beforeEach(() => {
    gateway = new MockGateway()
  })

  describe('default instantiation', () => {
    it('can be created without gateways', () => {
      const nodepay = new Nodepay()

      expect(nodepay.gateways).toStrictEqual(new Map())
    })

    it('can be created with an array', () => {
      const nodepay = new Nodepay([gateway])

      expect(nodepay.gateways.size).toBe(1)
      expect([...nodepay.gateways.keys()]).toStrictEqual(['mock'])
    })

    it('can be created with an object', () => {
      const nodepay = new Nodepay({
        'mock': gateway,
      })

      expect(nodepay.gateways.size).toBe(1)
      expect([...nodepay.gateways.keys()]).toStrictEqual(['mock'])
    })

    it('can be created with a map', () => {
      const gatewayMap = new Map()
      gatewayMap.set('mock', gateway)
      const nodepay = new Nodepay(gatewayMap)

      expect(nodepay.gateways.size).toBe(1)
      expect([...nodepay.gateways.keys()]).toStrictEqual(['mock'])
    })
  })

  describe('custom named instantiation', () => {
    it('can be created with an object', () => {
      const nodepay = new Nodepay({
        'myMock': gateway,
      })

      expect(nodepay.gateways.size).toBe(1)
      expect([...nodepay.gateways.keys()]).toStrictEqual(['myMock'])
    })

    it('can be created with a map', () => {
      const gatewayMap = new Map()
      gatewayMap.set('myMock', gateway)
      const nodepay = new Nodepay(gatewayMap)

      expect(nodepay.gateways.size).toBe(1)
      expect([...nodepay.gateways.keys()]).toStrictEqual(['myMock'])
    })
  })
})
