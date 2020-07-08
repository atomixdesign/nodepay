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

  test('it can be charged', async () => {
    const charge = await gateway.charge()
    const chargeRecurring = await gateway.chargeRecurring()
    const directDebit = await gateway.directDebit()

    expect(charge.result).toBe('once-off')
    expect(chargeRecurring.result).toBe('recurring')
    expect(directDebit.result).toBe('direct-debit')
  })

  test('it can be configured', () => {
    expect(gateway.config.apiKey).toBe('default-api-key')

    const newGateway = new TestGateway({
      apiKey: 'new-api-key',
    })

    expect(newGateway.config.apiKey).toBe('new-api-key')
  })

  test('before and after hooks work', () => {
    const gateway = new TestGateway({
      backwards: 'hello world',
      apiKey: '',
    })

    expect(gateway.config.backwards).toBe('dlrow olleh')
    expect(gateway.config.apiKey).toBe('empty-api-key')
  })
})

