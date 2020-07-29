import { Container } from 'typedi'
import cryptoRandomString from 'crypto-random-string'
import { IBaseResponse } from '@atomixdesign/nodepay-core/network'
import { BPOINTAPI as BpointTransport } from '../api'
import { BPOINTActionType, BPOINTCurrency, BPOINTTransactionType, } from '../../types'
import {
  ChargeDTO, CreditCardDTO, CustomerDTO,
} from '../dtos'

const fixtures = {
  creditCard: {
    cardHolderName: 'John Doe',
    cardNumber: '5123456789012346',
    CCV: '123',
    expiryDateMonth: '05',
    expiryDateYear: '2021',
  },
  simpleCharge: {
    Action: BPOINTActionType.payment,
    Amount: 100,
    CardDetails: undefined,
    Currency: BPOINTCurrency.AUD,
    Crn1: '',
    SubType: 'single' as const,
    TestMode: true,
    Type: BPOINTTransactionType.ecommerce,
  }
}

const validCodes = [
  200,
  201,
]

describe('test bpoint api transport', () => {
  let api: BpointTransport

  beforeAll(() => {
    Container.set('bpoint.config', {
      username: process.env['BPOINT_USERNAME']!,
      merchantId: process.env['BPOINT_MERCHANT_ID']!,
      password: process.env['BPOINT_PASSWORD']!,
      apiRoot: process.env['BPOINT_API_ROOT']!,
    })
    api = Container.get(BpointTransport)
  })

  afterAll(async () => {
    Container.reset()
  })

  test('it places a once-off charge using credit card', async () => {
    const chargeObject = {
      ...fixtures.simpleCharge,
      Crn1: cryptoRandomString({ length: 49 }),
      CardDetails: new CreditCardDTO(fixtures.creditCard),
    }
    const simpleCharge = new ChargeDTO(chargeObject)
    const response: IBaseResponse = await api.placeCharge(simpleCharge)

    expect(validCodes).toContain(response.status)
  })

  test('it places a recurring charge using credit card', async () => {
    const chargeObject = {
      ...fixtures.simpleCharge,
      Crn1: cryptoRandomString({ length: 49 }),
      CardDetails: new CreditCardDTO(fixtures.creditCard),
      SubType: 'recurring' as const,
    }
    const simpleCharge = new ChargeDTO(chargeObject)
    const response: IBaseResponse = await api.placeCharge(simpleCharge)

    expect(validCodes).toContain(response.status)
  })

  test('it registers a customer with a credit card', async () => {
    const customerObject = {
      CardDetails: new CreditCardDTO(fixtures.creditCard),
      EmailAddress: 'test@example.com',
      Crn1: cryptoRandomString({ length: 49 }),
    }
    const customer = new CustomerDTO(customerObject)
    const response: IBaseResponse = await api.addCustomer(customer)

    expect(validCodes).toContain(response.status)
  })
})
