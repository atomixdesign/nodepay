import { Container } from 'typedi'
import { Ezidebit } from '../ezidebit'
import { testAPI, APIResponse } from '../transport'
import { PaymentFrequency, DayOfWeek } from '../types'
// import moment from 'moment'

const fixtures = {
  simpleCharge: {
    CreditCardNumber: '5123456789012346',
    CreditCardExpiryMonth: '05',
    CreditCardExpiryYear: '2021',
    CreditCardCCV: '847',
    NameOnCreditCard: 'John Doe',
    PaymentAmount: 10,
    CustomerName: 'John Doe',
    PaymentReference: '123456789',
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
    YourSystemReference: '',
    ScheduleStartDate: '2022-01-01',
    SchedulePeriodType: PaymentFrequency.Monthly,
    DayOfWeek: '',
    DayOfMonth: 0,
    FirstWeekOfMonth: '',
    SecondWeekOfMonth: '',
    ThirdWeekOfMonth: '',
    FourthWeekOfMonth: '',
    PaymentAmountInCents: 2500,
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
    const { simpleCharge } = fixtures
    const charge: APIResponse = await gateway.charge(
      simpleCharge.CreditCardNumber,
      simpleCharge.CreditCardExpiryMonth,
      simpleCharge.CreditCardExpiryYear,
      simpleCharge.CreditCardCCV,
      simpleCharge.NameOnCreditCard,
      simpleCharge.PaymentAmount, // In whole currency
      simpleCharge.CustomerName,
      simpleCharge.PaymentReference,
    )

    expect(charge.data.resultText).toBe('OK')
  })

  test('it reports errors if the charge format is not correct', async () => {
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


  /* test('it can schedule a charge', async () => {
    const fixture = fixtures.paymentSchedule

    const charge: APIResponse = await gateway.chargeRecurring(
      /* fixture.customerNumber,
      fixture.frequency,
      fixture.nextPaymentDate,
      fixture.regularPrincipalAmount,
    )

    expect(charge.data.resultText).toBe('OK')
  }) */

  /*
  test('it reports errors if the schedule is incorrect', async () => {
    const fixture = fixtures.paymentScheduleBad

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const charge: APIResponse = await gateway.chargeRecurring(
      fixture.customerNumber,
      fixture.frequency,
      fixture.nextPaymentDate,
      fixture.regularPrincipalAmount,
    ).catch(error => {
      expect(typeof error).toBe('object')
      return error
    })
  }) */
})
