import { Container } from 'typedi'
import { API as EzidebitTransport } from '../api'
import { CustomerDTO, OnceOffChargeDTO } from '../../dtos'

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
  }
}

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

  test('it describes the web service', async () => {
    const service = await api.describe()
    expect(service).toBeDefined()
  })

  test('it places a once-off charge using credit card', async () => {
    const onceOffCharge = new OnceOffChargeDTO(fixtures.creditCard)
    const result: Record<string, unknown> = await api.placeCharge(onceOffCharge)
    const data = (result.Data as Record<string, unknown>)
    expect(data.PaymentResultText).toBe('APPROVED')
  })

  test('it reports an error when a once-off charge is declined', async () => {
    const onceOffCharge = new OnceOffChargeDTO(
      {
        ...fixtures.creditCard,
        ...{ PaymentAmountInCents: 1012 }
      }
    )
    const result: Record<string, unknown> = await api.placeCharge(onceOffCharge)
    expect(result.ErrorMessage).toBe('Declined')
  })

  test('it registers a customer account', async () => {
    const customer = new CustomerDTO(fixtures.customer)
    const result: Record<string, unknown> = await api.addCustomer(customer)
    const data = (result.Data as Record<string, unknown>)
    expect(data.CustomerRef).toBeDefined()
  })
})
