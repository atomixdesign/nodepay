import { Container } from 'typedi'
import cryptoRandomString from 'crypto-random-string'
import { Fatzebra } from '../fatzebra'
import { FatzebraAPI, testAPI, IFatzebraAPIResponse } from '../transport'
import { FatzebraConfig, FatzebraPaymentFrequency } from '../types'

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
    amountInCents: 1000,
    frequency: FatzebraPaymentFrequency.Weekly,
    startDate: '2027-05-09',
  },
  subscriptionBad: {
    customerId: '',
    amountInCents: -1,
    frequency: FatzebraPaymentFrequency.Weekly,
    startDate: 'incorrectDate',
  },
  address: {
    address1: 'Address',
    city: 'Adelaide',
    state: 'SA',
    postCode: '5799',
    country: 'Australia',
  },
}

describe.skip('test fatzebra gateway', () => {
  let gateway: Fatzebra

  beforeEach(() => {
    gateway = new Fatzebra({
      apiRoot: '',
      username: '',
      apiKey: '',
    } as FatzebraConfig)
  })

  afterAll(() => {
    Container.reset()
  })

  test('it has the right names', () => {
    expect(gateway.shortName).toBe('fatzebra')
    expect(gateway.name).toBe('Fatzebra')
  })

  test('it can be charged', async () => {
    const response: IFatzebraAPIResponse = await gateway.charge(
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
    const response: IFatzebraAPIResponse = await gateway.chargeRecurring(
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
    const response: IFatzebraAPIResponse = await gateway.addCustomer(
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
    const customer: IFatzebraAPIResponse = await gateway.updateCustomer(
      '123456789',
      { ...fixtures.customer, ...fixtures.address }
    )
    expect(customer.statusText).toBe('OK')
  })
})
