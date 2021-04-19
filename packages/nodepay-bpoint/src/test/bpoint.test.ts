import { Container } from 'typedi'
import { IBaseResponse } from '@atomixdesign/nodepay-core/network'
import { BPOINT } from '../bpoint'
import { BPOINTAPI, testAPI } from '../transport'

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
    Container.set(BPOINTAPI, new testAPI())
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
    await gateway.charge(
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

  test('it can create a customer', async () => {
    const customerObject = {
      emailAddress: 'test@example.com',
    }

    const customer: IBaseResponse = await gateway.addCustomer(
      customerObject,
      fixtures.creditCard,
    )
    expect(customer.statusText).toBe('OK')
  })

  test('it reports errors if the customer format is not correct', async () => {
    const customerObject = {
      emailAddress: '123',
    }

    await gateway.addCustomer(
      customerObject,
      fixtures.creditCard,
    ).catch(error => {
      expect(typeof error).toBe('object')
      return error
    })
  })

  test('it can update a customer', async () => {
    const customerObject = {
      emailAddress: 'test@example.com',
    }

    const customer: IBaseResponse = await gateway.updateCustomer(
      '123456789',
      customerObject,
      fixtures.creditCard,
    )
    expect(customer.statusText).toBe('OK')
  })
})
