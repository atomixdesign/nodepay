import { Container } from 'typedi'
import { Ezidebit } from '../ezidebit'
import { EzidebitAPI, testAPI, IEzidebitAPIResponse } from '../transport'
import { EzidebitPaymentFrequency, EzidebitDayOfWeek } from '../types'

const fixtures = {
  simpleCharge: {
    amountInCents: 1000,
    customerName: 'John Doe',
    orderNumber: '123456789',
  },
  simpleChargeBad: {
    amountInCents: -1000,
    customerName: '',
    orderNumber: 'fakeOrderNumber',
  },
  creditCard: {
    cardHolderName: 'John Doe',
    cardNumber: '5123456789012346',
    expiryDateMonth: '05',
    expiryDateYear: '2021',
    CCV: '847',
  },
  creditCardBad: {
    cardHolderName: 'John Doe',
    cardNumber: '5123456789012346',
    expiryDateMonth: '05',
    expiryDateYear: '1978',
    CCV: '-1',
  },
  directDebit: {
    eziDebitCustomerId: '',
    customerId: '123456789',
    debitDate: '2022-01-01',
    amountInCents: 20,
    paymentReference: '1234',
    username: 'jdoe',
  },
  paymentSchedule: {
    ezidebitCustomerId: '',
    customerId: '123456789',
    startDate: '2022-01-01',
    frequency: EzidebitPaymentFrequency.Monthly,
    dayOfWeek: EzidebitDayOfWeek.MON,
    dayOfMonth: 0,
    amountInCents: 2500,
    maxNumberPayments: 0,
    maxTotalAmount: 12500,
    keepManualPayments: 'NO' as const,
    username: 'jdoe',
  },
  customerDetails: {
    generalReference: '',
    firstName: 'John',
    lastName: 'Doe',
    address1: 'address1',
    address2: 'address2',
    postCode: '2000',
    suburb: 'suburb',
    region: 'QLD',
    emailAddress: 'test@example.com',
    phoneNumber: '0400123456',
    smsPaymentReminder: 'NO' as const,
    smsExpiredCard: 'NO' as const,
    smsFailedNotification: 'NO' as const,
    username: 'jdoe'
  }
}

describe('test ezidebit gateway', () => {
  let gateway: Ezidebit

  beforeAll(() => {
    Container.set(EzidebitAPI, new testAPI())
  })

  beforeEach(() => {
    gateway = new Ezidebit()
  })

  afterAll(() => {
    Container.reset()
  })

  test('it has the right names', () => {
    expect(gateway.shortName).toBe('ezidebit')
    expect(gateway.name).toBe('Ezidebit')
  })

  test('it can be charged', async () => {
    const charge: IEzidebitAPIResponse = await gateway.charge(
      fixtures.simpleCharge,
      fixtures.creditCard,
    )

    expect(charge.data.resultText).toBe('OK')
  })

  test('it reports errors if the charge format is not correct', async () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const charge: IEzidebitAPIResponse = await gateway.charge(
      fixtures.simpleChargeBad,
      fixtures.creditCardBad,
    ).catch(error => {
      expect(typeof error).toBe('object')
      return error
    })
  })


  test('it can be charged via direct debit', async () => {
    const { directDebit } = fixtures
    const charge: IEzidebitAPIResponse = await gateway.directDebit(
      directDebit,
    )
    expect(charge.data.resultText).toBe('OK')
  })

  test('it reports errors if the charge format is not correct in direct debit', async () => {
    const { directDebit } = fixtures
    directDebit.amountInCents = -1000
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const charge: IEzidebitAPIResponse = await gateway.directDebit(
      directDebit,
    ).catch(error => {
      expect(typeof error).toBe('object')
      return error
    })
  })

  test('it can schedule a charge', async () => {
    const { paymentSchedule } = fixtures
    const response: IEzidebitAPIResponse = await gateway.chargeRecurring(
      paymentSchedule,
    )
    expect(response?.data.resultText).toBe('OK')
  })

  test('it reports errors if the schedule is incorrect', async () => {
    const { paymentSchedule } = fixtures
    paymentSchedule.amountInCents = -1000

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const response: IEzidebitAPIResponse = await gateway.chargeRecurring(
      paymentSchedule,
    ).catch(error => {
      expect(typeof error).toBe('object')
      return error
    })
  })

  test('it can create a customer', async () => {
    const response: IEzidebitAPIResponse = await gateway.addCustomer({
      customerId: '123456789',
      contractStartDate: '2010-12-22',
      lastName: 'Doe',
      smsPaymentReminder: 'NO',
      smsExpiredCard: 'NO',
      smsFailedNotification: 'NO',
    })
    expect(response?.data.resultText).toBe('OK')
  })

  test('it can update a customer', async () => {
    const response: IEzidebitAPIResponse = await gateway.updateCustomer(
      '123456789',
      fixtures.customerDetails,
    )
    expect(response?.data.resultText).toBe('OK')
  })
})
