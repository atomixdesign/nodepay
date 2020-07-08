// import { ActionType, Currency, TransactionType } from '../types'
import { Container } from 'typedi'
import { BPOINT } from '../bpoint'
import { testAPI, APIResponse } from '../transport'
import { ActionType, Currency, TransactionType } from '../types'

const fixtures = {
  creditCard: {
    CardHolderName: 'John Doe',
    CardNumber: '5123456789012346',
    Cvn: '123',
    ExpiryMonth: '05',
    ExpiryYear: '21',
  },
  simpleCharge: {
    Action: ActionType.payment,
    Amount: 100,
    CardDetails: undefined,
    Currency: Currency.AUD,
    Crn1: '',
    SubType: 'single' as const,
    TestMode: true,
    Type: TransactionType.ecommerce,
  }
}

describe('test bpoint gateway', () => {
  let gateway: BPOINT

  beforeAll(() => {
    Container.set('bpoint.api', new testAPI())
  })

  beforeEach(() => {
    gateway = new BPOINT()
  })

  afterAll(() => {
    Container.reset()
  })

  test('it has the right names', () => {
    expect(gateway.shortName).toBe('bpoint')
    expect(gateway.name).toBe('BPOINT')
  })

  test('it can be charged', async () => {
    const { creditCard, simpleCharge } = fixtures
    const charge: APIResponse = await gateway.charge(
      creditCard.CardNumber,
      creditCard.ExpiryMonth,
      creditCard.ExpiryYear,
      creditCard.Cvn,
      creditCard.CardHolderName,
      simpleCharge.Amount,
    )

    expect(charge.statusText).toBe('OK')
  })

  test('it reports errors if the charge format is not correct', async () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const charge: APIResponse = await gateway.charge(
      'fakecc',
      '13',
      '39',
      'fakecvn',
      '',
      -1,
    ).catch(error => {
      expect(typeof error).toBe('object')
      return error
    })
  })

  test('it can schedule a charge', async () => {
    const { creditCard, simpleCharge } = fixtures
    const charge: APIResponse = await gateway.chargeRecurring(
      creditCard.CardNumber,
      creditCard.ExpiryMonth,
      creditCard.ExpiryYear,
      creditCard.Cvn,
      creditCard.CardHolderName,
      simpleCharge.Amount,
    )

    expect(charge.statusText).toBe('OK')
  })
})
