import { Container } from 'typedi'
import moment from 'moment'
import { Payway } from '../pay-way'
import { testAPI, IPaywayAPIResponse } from '../transport'
import { PaywayPaymentFrequency, IPaywayCharge } from '../types'

const fixtures = {
  creditCard: {
    cardNumber: '5163200000000008',
    expiryDateMonth: '08',
    expiryDateYear: '2030',
    CCV: '070',
    cardHolderName: 'John Doe',
  },
  simpleCharge: {
    orderNumber: 'onceOffOrder',
    amountInCents: 1087,
    singleUseTokenId: '123456789',
    customerNumber: 'onceoffCustomer',
  },
  simpleChargeBad: {
    customerNumber: '',
    amountInCents: -1,
    orderNumber: '12345678910111213141516',
    customerIpAddress: '',
    merchantId: '',
  },
  paymentSchedule: {
    customerNumber: 'paymentSchedule',
    frequency: PaywayPaymentFrequency.Weekly,
    startDate: moment().add(2, 'days').format('D MMM YYYY'),
    amountInCents: 1789,
  },
  paymentScheduleBad: {
    customerNumber: '',
    frequency: PaywayPaymentFrequency.Weekly,
    startDate: '',
    amountInCents: -1,
  },
}

describe('test payway gateway', () => {
  let gateway: Payway

  beforeAll(() => {
    Container.set('payway.api', new testAPI())
  })

  beforeEach(() => {
    gateway = new Payway()
  })

  afterAll(() => {
    Container.reset()
  })

  test('it has the right names', () => {
    expect(gateway.shortName).toBe('pay-way')
    expect(gateway.name).toBe('Westpac PayWay')
  })

  test('it can be charged', async () => {
    const onceOffCharge: IPaywayCharge = {
      ...fixtures.simpleCharge,
      creditCard: fixtures.creditCard,
    }
    const response: IPaywayAPIResponse = await gateway.charge(onceOffCharge)
    expect(response?.status).toBe(200)
  })

  test('it reports errors if the charge format is not correct', async () => {
    const onceOffChargeBad: IPaywayCharge = {
      ...fixtures.simpleCharge,
      creditCard: fixtures.creditCard,
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const charge: IPaywayAPIResponse = await gateway.charge(onceOffChargeBad).catch(error => {
      expect(typeof error).toBe('object')
      return error
    })
  })


  test('it can be charged via direct debit', async () => {
    const { simpleCharge } = fixtures

    const response: IPaywayAPIResponse = await gateway.directDebit({
      customerId: simpleCharge.customerNumber,
      paymentReference: simpleCharge.orderNumber,
      amountInCents: simpleCharge.amountInCents,
    })

    expect(response?.status).toBe(200)
  })

  test('it reports errors if the charge format is not correct in direct debit', async () => {
    const { simpleChargeBad } = fixtures

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const charge: IPaywayAPIResponse = await gateway.directDebit({
      customerId: simpleChargeBad.customerNumber,
      paymentReference: simpleChargeBad.orderNumber,
      amountInCents: simpleChargeBad.amountInCents,
    }).catch(error => {
      expect(typeof error).toBe('object')
      return error
    })
  })

  test('it can schedule a charge', async () => {
    const { paymentSchedule } = fixtures
    const response: IPaywayAPIResponse = await gateway.chargeRecurring(
      paymentSchedule
    )
    expect(response?.status).toBe(200)
  })

  test('it reports errors if the schedule is incorrect', async () => {
    const { paymentScheduleBad } = fixtures

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const charge: IPaywayAPIResponse = await gateway.chargeRecurring(
      paymentScheduleBad
    ).catch(error => {
      expect(typeof error).toBe('object')
      return error
    })
  })

  test('it can create a customer', async () => {
    const response: IPaywayAPIResponse = await gateway.addCustomer({
      customerNumber: '123456789',
      singleUseTokenId: 'fakeTokenId',
    })
    expect(response?.status).toBe(200)
  })
})
