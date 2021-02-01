import { Container } from 'typedi'
import { EzidebitAPI as EzidebitTransport } from '../api'
import { IEzidebitAPIResponse } from '../api-response'
// import { CustomerDTO, OnceOffChargeDTO, CreditCardDTO, PaymentDTO, PaymentScheduleDTO } from '../../dtos'
import { EzidebitPaymentFrequency, EzidebitDayOfWeek } from '../../types'
import crypto from 'crypto'

const fixtures = {
  simpleCharge: {
    CreditCardNumber: '5123456789012346',
    CreditCardExpiryMonth: '05',
    CreditCardExpiryYear: '2021',
    CreditCardCCV: '847',
    NameOnCreditCard: 'John Doe',
    PaymentAmountInCents: 1000,
    CustomerName: 'John Doe',
    PaymentReference: '123456789',
  },
  customer: {
    YourSystemReference: '',
    NewYourSystemReference: '',
    YourGeneralReference: '',
    LastName: 'Doe',
    FirstName: 'John',
    AddressLine1: '',
    AddressLine2: '',
    AddressSuburb: '',
    AddressState: '',
    AddressPostCode: '',
    EmailAddress: '',
    MobilePhoneNumber: '0400123456',
    ContractStartDate: '2021-12-22',
    SmsPaymentReminder: 'NO',
    SmsFailedNotification: 'NO',
    SmsExpiredCard: 'NO',
    Username: 'jdoe',
  },
  payment: {
    YourSystemReference: '',
    DebitDate: '2022-01-01',
    PaymentAmountInCents: 2000,
    PaymentReference: '1234',
    Username: 'jdoe',
  },
  paymentSchedule: {
    YourSystemReference: '',
    ScheduleStartDate: '2022-01-01',
    SchedulePeriodType: EzidebitPaymentFrequency.Monthly,
    DayOfWeek: EzidebitDayOfWeek.MON,
    DayOfMonth: 1,
    FirstWeekOfMonth: 'YES',
    SecondWeekOfMonth: 'NO',
    ThirdWeekOfMonth: 'NO',
    FourthWeekOfMonth: 'NO',
    PaymentAmountInCents: 2500,
    LimitToNumberOfPayments: 0,
    LimitToTotalAmountInCents: 12500,
    KeepManualPayments: 'NO',
    Username: 'jdoe',
  },
}

function randomId(length: number): string {
  return crypto.randomBytes(length / 2).toString('hex')
}

describe('test ezidebit api transport', () => {
  let api: EzidebitTransport

  beforeAll(() => {
    api = new EzidebitTransport({
      clientId: process.env['EZIDEBIT_CLIENT_ID']!,
      digitalKey: process.env['EZIDEBIT_DIGITAL_KEY']!,
      publicKey: process.env['EZIDEBIT_PUBLIC_KEY']!,
      apiRoot: process.env['EZIDEBIT_API_ROOT']!,
      nonPCIApiRoot: process.env['EZIDEBIT_API_NONPCI_ROOT']!,
    })
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
    // TODO: Enforce property order on DTOs? See Map.
    // const onceOffCharge = new OnceOffChargeDTO(fixtures.creditCard)
    const result: IEzidebitAPIResponse = await api.placeCharge(fixtures.simpleCharge)
    expect(result.data.PaymentResultText).toBe('APPROVED')
  })

  test('it reports an error when a once-off charge is declined', async () => {
    const badChargeFixture = fixtures.simpleCharge
    badChargeFixture.PaymentAmountInCents = 1012
    await api.placeCharge(badChargeFixture).catch(error => {
      expect(error.message).toBe('Declined')
      return error
    })
  })

  test('it registers a customer account', async () => {
    const { customer } = fixtures
    customer.YourSystemReference = randomId(32)
    const result: IEzidebitAPIResponse = await api.addCustomer(customer)
    expect(result.data.CustomerRef).toBeDefined()
  })

  test('it adds a credit card to a customer account', async () => {
    const { customer } = fixtures
    customer.YourSystemReference = randomId(32)
    const customerResponse: IEzidebitAPIResponse = await api.addCustomer(customer)

    let creditCardUpdateData: IEzidebitAPIResponse
    let creditCardUpdateResult = ''

    if (customerResponse.data.CustomerRef !== undefined) {
      const EziDebitCustomerID = customerResponse.data.CustomerRef as string
      const creditCardFixture = {
        EziDebitCustomerID,
        CreditCardNumber: fixtures.simpleCharge.CreditCardNumber,
        CreditCardExpiryMonth: fixtures.simpleCharge.CreditCardExpiryMonth,
        CreditCardExpiryYear: fixtures.simpleCharge.CreditCardExpiryYear,
        NameOnCreditCard: fixtures.simpleCharge.NameOnCreditCard,
        Reactivate: 'YES',
        YourSystemReference: '',
        Username: customer.Username,
      }
      creditCardUpdateData = await api.addCustomerCreditCard(creditCardFixture)
      creditCardUpdateResult = creditCardUpdateData.data[0] as string
    }

    expect(creditCardUpdateResult).toBe('S')
  })

  test('it adds a credit card and direct payment to a customer account', async () => {
    const { customer } = fixtures
    customer.YourSystemReference = randomId(32)
    const customerResponse: IEzidebitAPIResponse = await api.addCustomer(customer)

    let creditCardUpdateData: IEzidebitAPIResponse
    let creditCardUpdateResult = ''
    let paymentUpdateData: IEzidebitAPIResponse
    let paymentUpdateResult = ''

    if (customerResponse.data.CustomerRef !== undefined) {
      const EziDebitCustomerID = customerResponse.data.CustomerRef as string
      const creditCardFixture = {
        EziDebitCustomerID,
        CreditCardNumber: fixtures.simpleCharge.CreditCardNumber,
        CreditCardExpiryMonth: fixtures.simpleCharge.CreditCardExpiryMonth,
        CreditCardExpiryYear: fixtures.simpleCharge.CreditCardExpiryYear,
        NameOnCreditCard: fixtures.simpleCharge.NameOnCreditCard,
        Reactivate: 'YES',
        YourSystemReference: '',
        Username: customer.Username,
      }
      creditCardUpdateData = await api.addCustomerCreditCard(creditCardFixture)
      creditCardUpdateResult = creditCardUpdateData.data[0] as string
      if (creditCardUpdateResult === 'S') {
        const payment = {
          EziDebitCustomerID,
          ...fixtures.payment,
        }
        paymentUpdateData = await api.placeDirectCharge(payment)
        paymentUpdateResult = paymentUpdateData.data[0] as string
      }
    }

    expect(paymentUpdateResult).toBe('S')
  })

  test('it adds a credit card and a payment schedule to a customer account', async () => {
    const { customer } = fixtures
    customer.YourSystemReference = randomId(32)
    const customerResponse: IEzidebitAPIResponse = await api.addCustomer(customer)

    let creditCardUpdateData: IEzidebitAPIResponse
    let creditCardUpdateResult = ''

    let paymentScheduleUpdateData: IEzidebitAPIResponse
    let paymentScheduleUpdateResult = ''

    if (customerResponse.data.CustomerRef !== undefined) {
      const EziDebitCustomerID = customerResponse.data.CustomerRef as string
      const creditCardFixture = {
        EziDebitCustomerID,
        CreditCardNumber: fixtures.simpleCharge.CreditCardNumber,
        CreditCardExpiryMonth: fixtures.simpleCharge.CreditCardExpiryMonth,
        CreditCardExpiryYear: fixtures.simpleCharge.CreditCardExpiryYear,
        NameOnCreditCard: fixtures.simpleCharge.NameOnCreditCard,
        Reactivate: 'YES',
        YourSystemReference: '',
        Username: customer.Username,
      }
      creditCardUpdateData = await api.addCustomerCreditCard(creditCardFixture)
      creditCardUpdateResult = creditCardUpdateData.data[0] as string
      if (creditCardUpdateResult === 'S') {
        const paymentSchedule = {
          EziDebitCustomerID,
          ...fixtures.paymentSchedule,
        }
        paymentScheduleUpdateData = await api.schedulePayment(paymentSchedule)
        paymentScheduleUpdateResult = paymentScheduleUpdateData.data[0] as string
      }
    }

    expect(paymentScheduleUpdateResult).toBe('S')
  })

  test('it updates a customer account', async () => {
    const { customer } = fixtures
    customer.YourSystemReference = randomId(32)
    await api.addCustomer(customer)

    customer.NewYourSystemReference = customer.YourSystemReference
    customer.EmailAddress = 'updatedemail@example.com'

    const result: IEzidebitAPIResponse = await api.updateCustomer(customer)

    expect(result.statusText).toBe('S')
  })
})
