import { Container } from 'typedi'
import cryptoRandomString from 'crypto-random-string'
// import moment from 'moment'
import { PaystreamAPI as PaystreamTransport } from '../api'
import { IPaystreamAPIResponse } from '../api-response'
import {
  ChargeDTO,
  CreditCardDTO,
  PlanDTO,
  CustomerDTO,
} from '../dtos'

const validCodes = [
  200,
  201,
]

const fixtures = {
  customer: {
    firstName: 'John',
    lastName: 'Doe',
    reference: cryptoRandomString({ length: 10 }),
    email: 'mail@example.com',
    ipAddress: '169.254.169.254',
  },
  address: {
    address: 'The Street',
    city: 'The City',
    state: 'QLD',
    postcode: '69000',
    country: 'Australia',
  },
  creditCard: {
    cardNumber: '5123456789012346',
    cardHolderName: 'John Doe',
    CCV: '847',
    expiryDateMonth: '02',
    expiryDateYear: '2029'
  },
  bankAccount1: {
    BSBNumber: '650-000',
    accountNumber: '999994',
    accountName: 'John Doe',
  },
  onceOffCharge: {
    amountInCents: 1087,
    orderNumber: cryptoRandomString({ length: 10 }),
    customerIp: '169.254.169.254',
  },
  plan: {
    name: 'Test Plan',
    amount: 1000,
    reference: cryptoRandomString({ length: 10 }),
    description: 'This is a test plan.',
  },
}

describe('test paystream api transport', () => {
  let api: PaystreamTransport

  beforeAll(() => {
    Container.set('paystream.config', {
      username: process.env['PAYSTREAM_USERNAME']!,
      apiKey: process.env['PAYSTREAM_API_KEY']!,
      apiRoot: process.env['PAYSTREAM_API_ROOT']!,
    })
    api = Container.get(PaystreamTransport)
  })

  // See: https://www.payway.com.au/docs/net.html#test-card-numbers
  test('it retrieves a single use token for the credit card', async () => {
    const creditCard = new CreditCardDTO(fixtures.creditCard)
    const response: IPaystreamAPIResponse = await api.getCCtoken(creditCard)
    expect(validCodes).toContain(response.status)
  })

  test('it places a once-off charge using credit card', async () => {
    const chargeObject = { ...fixtures.onceOffCharge, creditCard: fixtures.creditCard }
    const onceOffCharge = new ChargeDTO(chargeObject)
    const response: IPaystreamAPIResponse = await api.placeCharge(onceOffCharge)

    expect(validCodes).toContain(response.status)
  })

  test('it can create a plan', async () => {
    const plan = new PlanDTO(fixtures.plan)
    const response: IPaystreamAPIResponse = await api.addPlan(plan)

    expect(validCodes).toContain(response.status)
  })

  test('it can add a customer', async () => {
    const customer = new CustomerDTO({
      ...fixtures.customer,
      creditCard: fixtures.creditCard,
      address: fixtures.address,
    })
    const response: IPaystreamAPIResponse = await api.addCustomer(customer)

    expect(validCodes).toContain(response.status)
  })
})
