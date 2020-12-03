import cryptoRandomString from 'crypto-random-string'
// import moment from 'moment'
import { FatzebraAPI as FatzebraTransport } from '../api'
import { IFatzebraAPIResponse } from '../api-response'
import {
  ChargeDTO,
  CreditCardDTO,
  CustomerDTO,
  // PaymentPlanDTO,
  BankAccountDTO,
  PaymentPlanDTO,
} from '../dtos'
import { FatzebraPaymentFrequency } from '../../types'

const validCodes = [
  200,
  201,
]

const fixtures = {
  customer: {
    firstName: 'John',
    lastName: 'Doe',
    reference: cryptoRandomString({ length: 32 }),
    emailAddress: 'mail@example.com',
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
    orderNumber: cryptoRandomString({ length: 32 }),
    customerIp: '169.254.169.254',
  },
  subscription: {
    customerId: '',
    amountInCents: 1000,
    frequency: FatzebraPaymentFrequency.Weekly,
    startDate: '2027-05-09',
  },
}

describe('test fatzebra api transport', () => {
  let api: FatzebraTransport

  beforeAll(() => {
    api = new FatzebraTransport(
      {
        username: process.env['FATZEBRA_USERNAME']!,
        apiKey: process.env['FATZEBRA_API_KEY']!,
        apiRoot: process.env['FATZEBRA_API_ROOT']!,
      }
    )
  })

  // See: https://www.payway.com.au/docs/net.html#test-card-numbers
  test('it retrieves a single use token for the credit card', async () => {
    const creditCard = new CreditCardDTO(fixtures.creditCard)
    const response: IFatzebraAPIResponse = await api.getCCtoken(creditCard)
    expect(validCodes).toContain(response.status)
  })

  test('it retrieves a single use token for the bank account', async () => {
    const bankAccount = new BankAccountDTO(fixtures.bankAccount1)
    const response: IFatzebraAPIResponse = await api.getBankAccountToken(bankAccount)
    expect(validCodes).toContain(response.status)
  })

  test('it places a once-off charge using credit card', async () => {
    const onceOffCharge = new ChargeDTO(
      fixtures.onceOffCharge,
      fixtures.creditCard,
    )
    const response: IFatzebraAPIResponse = await api.placeCharge(onceOffCharge)

    expect(validCodes).toContain(response.status)
  })

  test('it can add a customer with a credit card', async () => {
    const customer = new CustomerDTO(
      { ...fixtures.customer, ...{ reference: cryptoRandomString({ length: 32 }) } },
      fixtures.creditCard,
      fixtures.bankAccount1,
      fixtures.address,
    )

    const response: IFatzebraAPIResponse = await api.addCustomer(customer)

    expect(validCodes).toContain(response.status)
  })

  test('it can add a customer with a bank account', async () => {
    const customer = new CustomerDTO(
      { ...fixtures.customer, ...{ reference: cryptoRandomString({ length: 32 }) } },
      undefined, // fixtures.creditCard,
      fixtures.bankAccount1,
      fixtures.address,
    )

    const response: IFatzebraAPIResponse = await api.addCustomer(customer)

    expect(validCodes).toContain(response.status)
  })

  test('it can add a subscription using a credit card', async () => {
    const customer = new CustomerDTO(
      { ...fixtures.customer, ...{ reference: cryptoRandomString({ length: 32 }) } },
      fixtures.creditCard,
      undefined,
      fixtures.address,
    )
    const customerResponse: IFatzebraAPIResponse = await api.addCustomer(customer)

    const subscription = new PaymentPlanDTO({
      ...fixtures.subscription,
      customerId: customerResponse?.data?.id,
      paymentMethod: 'Credit Card',
    })
    const response: IFatzebraAPIResponse = await api.addPaymentPlan(subscription)

    expect(validCodes).toContain(response.status)
  })

  test('it can add a subscription using a bank account', async () => {
    const customer = new CustomerDTO(
      {
        ...fixtures.customer,
        firstName: 'John',
        ...{ reference: cryptoRandomString({ length: 32 }) },
      },
      undefined,
      fixtures.bankAccount1,
      fixtures.address,
    )
    const customerResponse: IFatzebraAPIResponse = await api.addCustomer(customer)

    const subscription = new PaymentPlanDTO({
      ...fixtures.subscription,
      customerId: customerResponse?.data?.id,
      paymentMethod: 'Direct Debit',
    })
    const response: IFatzebraAPIResponse = await api.addPaymentPlan(subscription)

    expect(validCodes).toContain(response.status)
  })


  test('it can retrieve a customer', async () => {
    const reference = cryptoRandomString({ length: 32 })
    const customer = new CustomerDTO(
      { ...fixtures.customer, ...{ reference } },
      undefined, //fixtures.creditCard,
      fixtures.bankAccount1,
      fixtures.address,
    )
    const customerResponse: IFatzebraAPIResponse = await api.addCustomer(customer)
    const id = customerResponse?.data?.id as string

    const customerProfile: IFatzebraAPIResponse = await api.getCustomer(id)

    expect(validCodes).toContain(customerProfile.status)
  })

  test('it can update a customer', async () => {
    const reference = cryptoRandomString({ length: 32 })
    const customer = new CustomerDTO(
      { ...fixtures.customer, ...{ reference } },
      fixtures.creditCard,
      undefined,
      fixtures.address,
    )
    const customerResponse: IFatzebraAPIResponse = await api.addCustomer(customer)
    const id = customerResponse?.data?.id as string

    const updateCustomer = new CustomerDTO(
      { ...fixtures.customer, ...{ reference } },
      undefined,
      undefined,
      fixtures.address,
    )

    const updateResponse: IFatzebraAPIResponse = await api.updateCustomer(id, updateCustomer)

    expect(validCodes).toContain(updateResponse.status)
  })
})
