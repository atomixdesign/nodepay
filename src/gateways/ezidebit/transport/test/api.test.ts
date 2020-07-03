import { Container } from 'typedi'
import { API as EzidebitTransport } from '../api'
import { APIResponse } from '../api-response'
import { CustomerDTO, OnceOffChargeDTO, CreditCardDTO, PaymentDTO } from '../../dtos'
// import crypto from 'crypto'

const fixtures = {
  creditCard: {
    CreditCardNumber: '5123456789012346',
    CreditCardExpiryMonth: '05',
    CreditCardExpiryYear: '2021',
    CreditCardCCV: '847',
    NameOnCreditCard: 'John Doe',
    PaymentAmountInCents: 1000,
    PaymentReference: '123456789',
  },
  customer: {
    YourSystemReference: '123456789',
    LastName: 'Doe',
    SmsPaymentReminder: 'NO',
    SmsFailedNotification: 'NO',
    SmsExpiredCard: 'NO',
    FirstName: 'John',
    MobilePhoneNumber: '0400123456',
    Username: 'jdoe',
    ContractStartDate: '2021-12-22',
  },
  payment: {
    DebitDate: '2022-01-01',
    PaymentAmountInCents: 2000,
    PaymentReference: '1234',
    Username: 'jdoe',
  },
}

/* function randomId(length: number): string {
  return crypto.randomBytes(length / 2).toString('hex')
} */

describe('test ezidebit api transport', () => {
  let api: EzidebitTransport

  beforeAll(() => {
    Container.set('ezidebit.config', {
      clientId: process.env['EZIDEBIT_CLIENT_ID']!,
      digitalKey: process.env['EZIDEBIT_DIGITAL_KEY']!,
      publicKey: process.env['EZIDEBIT_PUBLIC_KEY']!,
      apiRoot: process.env['EZIDEBIT_TEST_API_ROOT']!,
      nonPCIApiRoot: process.env['EZIDEBIT_TEST_API_NONPCI_ROOT']!,
    })
    api = Container.get(EzidebitTransport)
  })

  afterAll(async () => {
    Container.reset()
  })

  test('it describes the web services', async () => {
    const pciService = await api.describe()
    const nonPCIService = await api.describe(false)
    expect(pciService).toBeDefined()
    expect(nonPCIService).toBeDefined()
  })

  test('it places a once-off charge using credit card', async () => {
    const onceOffCharge = new OnceOffChargeDTO(fixtures.creditCard)
    const result: APIResponse = await api.placeCharge(onceOffCharge)
    expect(result.Data.PaymentResultText).toBe('APPROVED')
  })

  test('it reports an error when a once-off charge is declined', async () => {
    const onceOffCharge = new OnceOffChargeDTO(
      {
        ...fixtures.creditCard,
        ...{ PaymentAmountInCents: 1012 }
      }
    )
    const result: APIResponse = await api.placeCharge(onceOffCharge)
    expect(result.ErrorMessage).toBe('Declined')
  })

  /* test('it registers a customer account', async () => {
    const customer = new CustomerDTO(fixtures.customer)
    // customer.YourSystemReference = randomId(32)
    console.dir(customer, { depth: 0 })
    const result: APIResponse = await api.addCustomer(customer)
    expect(result.Data.CustomerRef).toBeDefined()
  }) */

  /* test('it adds a credit card to a customer account', async () => {
    const customer = new CustomerDTO(fixtures.customer)
    // customer.YourSystemReference = randomId(32)
    console.dir(customer, { depth: 0 })
    const customerResponse: APIResponse = await api.addCustomer(customer)

    // console.dir(customerResult, { depth: 0 })
    // console.dir(customerData, { depth: 0 })

    const creditCardFixture = fixtures.creditCard
    const creditCard = new CreditCardDTO({
      CreditCardNumber: creditCardFixture.CreditCardNumber,
      CreditCardExpiryMonth: creditCardFixture.CreditCardExpiryMonth,
      CreditCardExpiryYear: creditCardFixture.CreditCardExpiryYear,
      NameOnCreditCard: creditCardFixture.NameOnCreditCard,
      Reactivate: 'YES',
      Username: customer.Username,
    })
    let creditCardUpdateData: APIResponse
    let creditCardUpdateResult = ''

    if (customerResponse.Data.CustomerRef !== undefined) {
      const customerId  = customerResponse.Data.CustomerRef as string
      creditCard.EziDebitCustomerID = customerId
      creditCardUpdateData = await api.addCustomerCC(creditCard)
      // console.dir(creditCardUpdateData, { depth: 0 })
      creditCardUpdateResult = creditCardUpdateData.Data[0] as string
    }

    expect(creditCardUpdateResult).toBe('S')
  }) */

  test('it adds a credit card and direct debit payment to a customer account', async () => {
    const customer = new CustomerDTO(fixtures.customer)
    const customerResponse: APIResponse = await api.addCustomer(customer)

    const creditCardFixture = fixtures.creditCard
    const creditCard = new CreditCardDTO({
      CreditCardNumber: creditCardFixture.CreditCardNumber,
      CreditCardExpiryMonth: creditCardFixture.CreditCardExpiryMonth,
      CreditCardExpiryYear: creditCardFixture.CreditCardExpiryYear,
      NameOnCreditCard: creditCardFixture.NameOnCreditCard,
      Reactivate: 'YES',
      Username: customer.Username,
    })
    let creditCardUpdateData: APIResponse
    let creditCardUpdateResult = ''

    const paymentFixture = fixtures.payment
    const payment = new PaymentDTO({
      DebitDate: paymentFixture.DebitDate,
      PaymentAmountInCents: paymentFixture.PaymentAmountInCents,
      PaymentReference: paymentFixture.PaymentReference,
      Username: paymentFixture.Username,
    })
    let paymentUpdateData: APIResponse
    let paymentUpdateResult = ''

    if (customerResponse.Data.CustomerRef !== undefined) {
      const customerId  = customerResponse.Data.CustomerRef as string
      creditCard.EziDebitCustomerID = customerId
      creditCardUpdateData = await api.addCustomerCC(creditCard)
      // console.dir(creditCardUpdateData, { depth: 0 })
      creditCardUpdateResult = creditCardUpdateData.Data[0] as string
      if (creditCardUpdateResult === 'S') {
        payment.EziDebitCustomerID = customerId
        paymentUpdateData = await api.placeDirectCharge(payment)
        paymentUpdateResult = paymentUpdateData.Data[0] as string
      }
    }

    expect(paymentUpdateResult).toBe('S')
  })
})
