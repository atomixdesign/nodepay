import { Container } from 'typedi'
import { IBaseResponse } from '@atomixdesign/nodepay-core/network'
import { BPOINT } from '../bpoint'
import { testAPI } from '../transport'

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
    const charge: IBaseResponse = await gateway.charge(
      fixtures.simpleCharge,
      fixtures.creditCard,
    )
    expect(charge.statusText).toBe('OK')
  })

  test('it reports errors if the charge format is not correct', async () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const charge: IBaseResponse = await gateway.charge(
      fixtures.simpleChargeBad,
      fixtures.creditCardBad,
    ).catch(error => {
      expect(typeof error).toBe('object')
      return error
    })
  })

  test('it can schedule a charge', async () => {
    const charge: IBaseResponse = await gateway.chargeRecurring(
      fixtures.simpleCharge,
      fixtures.creditCard,
    )
    expect(charge.statusText).toBe('OK')
  })
})
