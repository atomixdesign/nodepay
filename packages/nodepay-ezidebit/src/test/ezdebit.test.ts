import { Container } from 'typedi'
import { Ezidebit } from '../ezidebit'
import { testAPI, IEzidebitAPIResponse } from '../transport'
import { EzidebitPaymentFrequency, EzidebitDayOfWeek } from '../types'

const fixtures = {
  simpleCharge: {
    PaymentAmount: 10,
    CustomerName: 'John Doe',
    PaymentReference: '123456789',
  },
  creditCard: {
    cardHolderName: 'John Doe',
    cardNumber: '5123456789012346',
    expiryDateMonth: '05',
    expiryDateYear: '2021',
    CCV: '847',
  },
  payment: {
    EziDebitCustomerID: '',
    YourSystemReference: '123456789',
    DebitDate: '2022-01-01',
    PaymentAmount: 20,
    PaymentReference: '1234',
    Username: 'jdoe',
  },
  paymentSchedule: {
    EziDebitCustomerID: '',
    YourSystemReference: '123456789',
    ScheduleStartDate: '2022-01-01',
    SchedulePeriodType: EzidebitPaymentFrequency.Monthly,
    DayOfWeek: EzidebitDayOfWeek.MON,
    DayOfMonth: 0,
    FirstWeekOfMonth: '',
    SecondWeekOfMonth: '',
    ThirdWeekOfMonth: '',
    FourthWeekOfMonth: '',
    PaymentAmount: 25,
    LimitToNumberOfPayments: 0,
    LimitToTotalAmountInCents: 12500,
    KeepManualPayments: 'NO',
    Username: 'jdoe',
  },
}

describe('test ezidebit gateway', () => {
  let gateway: Ezidebit

  beforeAll(() => {
    Container.set('ezidebit.api', new testAPI())
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
    const { simpleCharge, creditCard } = fixtures
    const charge: IEzidebitAPIResponse = await gateway.charge(
      simpleCharge.PaymentReference,
      simpleCharge.PaymentAmount, // In whole currency
      creditCard,
      {
        customerName: simpleCharge.CustomerName,
      },
    )

    expect(charge.data.resultText).toBe('OK')
  })

  /* test('it reports errors if the charge format is not correct', async () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const charge: APIResponse = await gateway.charge(
      'fakecc',
      'alpha',
      'beta',
      'gamma',
      '',
      -1,
      '',
      '',
    ).catch(error => {
      expect(typeof error).toBe('object')
      return error
    })
  })

  test('it can be charged via direct debit', async () => {
    const { payment } = fixtures
    const charge: APIResponse = await gateway.directDebit(
      payment.EziDebitCustomerID,
      payment.YourSystemReference,
      payment.DebitDate,
      payment.PaymentAmount,  // In whole currency
      payment.PaymentReference,
      payment.Username,
    )

    expect(charge.data.resultText).toBe('OK')
  })

  test('it reports errors if the charge format is not correct in direct debit', async () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const charge: APIResponse = await gateway.directDebit(
      '',
      '',
      'purple',
      -1,  // In whole currency
      '',
      '',
    ).catch(error => {
      expect(typeof error).toBe('object')
      return error
    })
  })


  test('it can schedule a charge', async () => {
    const { paymentSchedule } = fixtures

    const response: APIResponse = await gateway.chargeRecurring(
      paymentSchedule.EziDebitCustomerID,
      paymentSchedule.YourSystemReference,
      paymentSchedule.SchedulePeriodType,
      paymentSchedule.ScheduleStartDate,
      paymentSchedule.DayOfWeek,
      paymentSchedule.DayOfMonth,
      paymentSchedule.PaymentAmount,
      0,
      15000,
      'NO',
      'jdoe',
    )

    expect(response?.data.resultText).toBe('OK')
  })

  test('it reports errors if the schedule is incorrect', async () => {
    const { paymentSchedule } = fixtures

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const response: APIResponse = await gateway.chargeRecurring(
      '123456789',
      paymentSchedule.YourSystemReference,
      paymentSchedule.SchedulePeriodType,
      '0-0-0000',
      paymentSchedule.DayOfWeek,
      -1,
      -10,
      0,
      15000,
      'MAYBE',
      '',
    ).catch(error => {
      expect(typeof error).toBe('object')
      return error
    })
  }) */
})
