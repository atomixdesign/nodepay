import { Container } from 'typedi'
import cryptoRandomString from 'crypto-random-string'
import { Paystream } from '../paystream'
import { PaystreamAPI, testAPI, IPaystreamAPIResponse } from '../transport'
import { PaystreamPaymentFrequency } from '../types'

const fixtures = {
  customer: {
    firstName: 'John',
    lastName: 'Doe',
    reference: cryptoRandomString({ length: 32 }),
    emailAddress: 'mail@example.com',
    ipAddress: '169.254.169.254',
  },
  customerBad: {
    firstName: '',
    lastName: '',
    reference: cryptoRandomString({ length: 32 }),
    emailAddress: 'invalidEmail',
    ipAddress: 'invalidId',
  },
  creditCard: {
    cardNumber: '5163200000000008',
    expiryDateMonth: '08',
    expiryDateYear: '2030',
    CCV: '070',
    cardHolderName: 'John Doe',
  },
  simpleCharge: {
    amountInCents: 1087,
    orderNumber: cryptoRandomString({ length: 32 }),
    customerIp: '169.254.169.254',
  },
  simpleChargeBad: {
    amountInCents: -1,
    orderNumber: cryptoRandomString({ length: 32 }),
    customerIp: 'incorrectIp',
  },
  subscription: {
    customerId: 'customerRef',
    plan: 'planRef',
    frequency: PaystreamPaymentFrequency.Weekly,
    startDate: '2027-05-09',
    reference: cryptoRandomString({ length: 32 }),
    isActive: true
  },
  subscriptionBad: {
    customerId: '',
    plan: '',
    frequency: PaystreamPaymentFrequency.Weekly,
    startDate: 'incorrectDate',
    reference: '',
    isActive: true
  },
  address: {
    address1: 'Address',
    city: 'Adelaide',
    state: 'SA',
    postCode: '5799',
    country: 'Australia',
  },
}

describe('test paystream gateway', () => {
  let gateway: Paystream

  beforeAll(() => {
    Container.set(PaystreamAPI, new testAPI())
  })

  beforeEach(() => {
    gateway = new Paystream()
  })

  afterAll(() => {
    Container.reset()
  })

  test('it has the right names', () => {
    expect(gateway.shortName).toBe('paystream')
    expect(gateway.name).toBe('Paystream')
  })

  test('it can be charged', async () => {
    const response: IPaystreamAPIResponse = await gateway.charge(
      fixtures.simpleCharge,
      fixtures.creditCard,
    )
    expect(response?.status).toBe(200)
  })

  test('it reports errors if the charge format is not correct', async () => {
    await gateway.charge(
      fixtures.simpleChargeBad,
      fixtures.creditCard,
    ).catch(error => {
      expect(typeof error).toBe('object')
      return error
    })
  })

  test('it can create a subscription', async () => {
    const response: IPaystreamAPIResponse = await gateway.chargeRecurring(
      fixtures.subscription
    )
    expect(response?.status).toBe(200)
  })

  test('it reports errors if the subscription format is incorrect', async () => {
    await gateway.chargeRecurring(
      fixtures.subscriptionBad
    ).catch(error => {
      expect(typeof error).toBe('object')
      return error
    })
  })

  test('it can create a customer', async () => {
    const response: IPaystreamAPIResponse = await gateway.addCustomer(
      { ...fixtures.customer, ...fixtures.address }
    )
    expect(response?.status).toBe(200)
  })

  test('it reports errors if the customer format is incorrect', async () => {
    await gateway.addCustomer(
      { ...fixtures.customer, ...fixtures.address }
    ).catch(error => {
      expect(typeof error).toBe('object')
      return error
    })
  })

  test('it can update a customer', async () => {
    const customer: IPaystreamAPIResponse = await gateway.updateCustomer(
      '123456789',
      { ...fixtures.customer, ...fixtures.address }
    )
    expect(customer.statusText).toBe('OK')
  })
})
