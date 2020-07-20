import { Container } from 'typedi'
import { BPOINT } from '../bpoint'
import { testAPI, IBPOINTAPIResponse } from '../transport'
import { IBPOINTCharge } from '../types'

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
    amountInCents: 100,
  },
  simpleChargeBad: {
    orderNumber: '123456789',
    amountInCents: -1,
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
    const onceOffCharge: IBPOINTCharge = {
      ...fixtures.simpleCharge,
      creditCard: fixtures.creditCard,
    }
    const charge: IBPOINTAPIResponse = await gateway.charge(onceOffCharge)
    expect(charge.statusText).toBe('OK')
  })

  test('it reports errors if the charge format is not correct', async () => {
    const onceOffChargeBad: IBPOINTCharge = {
      ...fixtures.simpleChargeBad,
      creditCard: fixtures.creditCardBad,
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const charge: IBPOINTAPIResponse = await gateway.charge(
      onceOffChargeBad
    ).catch(error => {
      expect(typeof error).toBe('object')
      return error
    })
  })

  test('it can schedule a charge', async () => {
    const recurringCharge: IBPOINTCharge = {
      ...fixtures.simpleCharge,
      creditCard: fixtures.creditCard,
    }
    const charge: IBPOINTAPIResponse = await gateway.chargeRecurring(recurringCharge)
    expect(charge.statusText).toBe('OK')
  })
})
