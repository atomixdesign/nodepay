import { Container } from 'typedi'
import { PayWay } from '../pay-way'
import { testAPI, APIResponse } from '../transport'
import { PaymentFrequency } from '../types/payment-frequency'
import moment from 'moment'

const fixtures = {
  simpleCharge: {
    orderNumber: 'onceOffOrder',
    principalAmount: 10.87,
    singleUseTokenId: '123456789',
    customerNumber: 'onceoffCustomer',
  },
  creditCard: {
    cardNumber: '5163200000000008',
    expiryDateMonth: '08',
    expiryDateYear: '2030',
    CCV: '070',
    cardHolderName: 'John Doe',
  },
  simpleChargeBad: {
    customerNumber: '',
    principalAmount: -1,
    orderNumber: '12345678910111213141516',
    customerIpAddress: '',
    merchantId: '',
  },
  paymentSchedule: {
    customerNumber: 'paymentSchedule',
    frequency: PaymentFrequency.Weekly,
    nextPaymentDate: moment().add(2, 'days').format('D MMM YYYY'),
    regularPrincipalAmount: 17.89,
  },
  paymentScheduleBad: {
    customerNumber: '',
    frequency: PaymentFrequency.Weekly,
    nextPaymentDate: '',
    regularPrincipalAmount: -1,
  },
}

describe('test payway gateway', () => {
  let gateway: PayWay

  beforeAll(() => {
    Container.set('payway.api', new testAPI())
  })

  beforeEach(() => {
    gateway = new PayWay()
  })

  afterAll(() => {
    Container.reset()
  })

  test('it has the right names', () => {
    expect(gateway.shortName).toBe('pay-way')
    expect(gateway.name).toBe('Westpac PayWay')
  })

  test('it can be charged', async () => {
    const fixture = fixtures.simpleCharge

    const response: APIResponse = await gateway.charge(
      fixture.singleUseTokenId,
      fixture.principalAmount,
      fixtures.creditCard,
      {
        customerNumber: fixture.customerNumber,
      }
    )

    expect(response?.status).toBe(200)
  })

  /* test('it reports errors if the charge format is not correct', async () => {
    const fixture = fixtures.simpleChargeBad

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const charge: APIResponse = await gateway.charge(
      '',
      fixture.customerNumber,
      fixture.principalAmount,
      fixture.orderNumber,
      fixture.customerIpAddress,
      fixture.merchantId,
    ).catch(error => {
      expect(typeof error).toBe('object')
      return error
    })
  })

  test('it can be charged via direct debit', async () => {
    const fixture = fixtures.simpleCharge

    const response: APIResponse = await gateway.directDebit(
      fixture.customerNumber,
      fixture.principalAmount,
    )

    expect(response?.status).toBe(200)
  })

  test('it reports errors if the charge format is not correct in direct debit', async () => {
    const fixture = fixtures.simpleChargeBad

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const charge: APIResponse = await gateway.directDebit(
      fixture.customerNumber,
      fixture.principalAmount,
      fixture.orderNumber,
      fixture.customerIpAddress,
      fixture.merchantId,
    ).catch(error => {
      expect(typeof error).toBe('object')
      return error
    })
  })

  test('it can schedule a charge', async () => {
    const fixture = fixtures.paymentSchedule

    const response: APIResponse = await gateway.chargeRecurring(
      fixture.customerNumber,
      fixture.frequency,
      fixture.nextPaymentDate,
      fixture.regularPrincipalAmount,
    )

    expect(response?.status).toBe(200)
  })

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
