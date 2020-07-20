import { Container } from 'typedi'
import { Ezidebit } from '../ezidebit'
import { testAPI, IEzidebitAPIResponse } from '../transport'
import { EzidebitPaymentFrequency, EzidebitDayOfWeek, IEzidebitCharge } from '../types'

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
    eziDebitCustomerNumber: '',
    customerId: '123456789',
    debitDate: '2022-01-01',
    amountInCents: 20,
    paymentReference: '1234',
    username: 'jdoe',
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
    const onceOffCharge: IEzidebitCharge = {
      ...fixtures.simpleCharge,
      creditCard: fixtures.creditCard,
    }
    const charge: IEzidebitAPIResponse = await gateway.charge(
      onceOffCharge
    )

    expect(charge.data.resultText).toBe('OK')
  })

  test('it reports errors if the charge format is not correct', async () => {
    const onceOffChargeBad: IEzidebitCharge = {
      ...fixtures.simpleChargeBad,
      creditCard: fixtures.creditCardBad,
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const charge: IEzidebitAPIResponse = await gateway.charge(
      onceOffChargeBad
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

  /*
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
