import { TestGateway } from './test-gateway'

describe('test gateway', () => {
  let gateway: TestGateway

  beforeEach(() => {
    gateway = new TestGateway()
  })

  test('it has the right names', () => {
    expect(gateway.shortName).toBe('test')
    expect(gateway.name).toBe('Test payment gateway')
  })

  test('it can be charged', () => {
    expect(gateway.charge()).toBe('once-off')
    expect(gateway.chargeRecurring()).toBe('recurring')
    expect(gateway.directDebit()).toBe('direct-debit')
  })
})
