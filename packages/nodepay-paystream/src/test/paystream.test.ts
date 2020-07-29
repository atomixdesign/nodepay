import { Container } from 'typedi'
// import moment from 'moment'
import cryptoRandomString from 'crypto-random-string'
import { Paystream } from '../paystream'
import { testAPI, IPaystreamAPIResponse } from '../transport'
import { PaystreamPaymentFrequency, IPaystreamInternalCharge } from '../types'


const fixtures = {
  customer: {
    firstName: 'John',
    lastName: 'Doe',
    reference: cryptoRandomString({ length: 10 }),
    emailAddress: 'mail@example.com',
    ipAddress: '169.254.169.254',
  },
  customerBad: {
    firstName: '',
    lastName: '',
    reference: cryptoRandomString({ length: 10 }),
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
    orderNumber: cryptoRandomString({ length: 10 }),
    customerIp: '169.254.169.254',
  },
  simpleChargeBad: {
    amountInCents: -1,
    orderNumber: cryptoRandomString({ length: 10 }),
    customerIp: 'incorrectIp',
  },
  subscription: {
    customer: 'customerRef',
    plan: 'planRef',
    frequency: PaystreamPaymentFrequency.Weekly,
    startDate: '2027-05-09',
    reference: cryptoRandomString({ length: 10 }),
    isActive: true
  },
  subscriptionBad: {
    customer: '',
    plan: '',
    frequency: PaystreamPaymentFrequency.Weekly,
    startDate: 'incorrectDate',
    reference: '',
    isActive: true
  },
}

describe('test paystream gateway', () => {
  let gateway: Paystream

  beforeAll(() => {
    Container.set('paystream.api', new testAPI())
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
    const onceOffCharge: IPaystreamInternalCharge = {
      ...fixtures.simpleCharge,
      ...fixtures.creditCard,
    }
    const response: IPaystreamAPIResponse = await gateway.charge(onceOffCharge)
    expect(response?.status).toBe(200)
  })

  test('it reports errors if the charge format is not correct', async () => {
    const onceOffChargeBad: IPaystreamInternalCharge = {
      ...fixtures.simpleCharge,
      ...fixtures.creditCard,
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const charge: IPaystreamAPIResponse = await gateway.charge(onceOffChargeBad).catch(error => {
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

  test('it reports errors if the subscription is incorrect', async () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const charge: IPaystreamAPIResponse = await gateway.chargeRecurring(
      fixtures.subscriptionBad
    ).catch(error => {
      expect(typeof error).toBe('object')
      return error
    })
  })

  test('it can create a customer', async () => {
    const response: IPaystreamAPIResponse = await gateway.addCustomer(
      fixtures.customer
    )
    expect(response?.status).toBe(200)
  })

  test('it reports errors if the customer info is incorrect', async () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const charge: IPaystreamAPIResponse = await gateway.addCustomer(
      fixtures.customerBad
    ).catch(error => {
      expect(typeof error).toBe('object')
      return error
    })
  })
})
