jest.mock('../transport/api')
// import { ActionType, Currency, TransactionType } from '../types'
import { Container } from 'typedi'
import { BPOINT } from '../bpoint'
import { testAPI, APIResponse } from '../transport'

const fixtures = {
  creditCard: {
    cardHolderName: 'John Doe',
    cardNumber: '5123456789012346',
    CCV: '123',
    expiryDateMonth: '05',
    expiryDateYear: '21',
  },
  creditCardBad: {
    cardHolderName: 'John Doe',
    cardNumber: 'fake cc',
    CCV: 'fake ccv',
    expiryDateMonth: '14',
    expiryDateYear: '00',
  },
  simpleCharge: {
    orderNumber: '123456789',
    amount: 100,
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
      simpleCharge.orderNumber,
      simpleCharge.amount,
      creditCard,
    )

    expect(charge.statusText).toBe('OK')
  })

  test('it reports errors if the charge format is not correct', async () => {
    const { creditCardBad, simpleCharge } = fixtures
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const charge: APIResponse = await gateway.charge(
      simpleCharge.orderNumber,
      -1,
      creditCardBad,
    ).catch(error => {
      expect(typeof error).toBe('object')
      return error
    })
  })

  test('it can schedule a charge', async () => {
    const { creditCard, simpleCharge } = fixtures
    const charge: APIResponse = await gateway.chargeRecurring(
      simpleCharge.orderNumber,
      simpleCharge.amount,
      creditCard,
    )

    expect(charge.statusText).toBe('OK')
  })
})
