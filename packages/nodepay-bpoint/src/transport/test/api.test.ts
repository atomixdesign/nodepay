import { Container } from 'typedi'
import cryptoRandomString from 'crypto-random-string'
import { IBaseResponse } from '@atomixdesign/nodepay-core/network'
import { BPOINTAPI as BpointTransport } from '../api'
import { BPOINTActionType, BPOINTCurrency, BPOINTTransactionType, } from '../../types'
import {
  ChargeDTO, CustomerDTO,
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
    api = new BpointTransport({
      username: process.env['BPOINT_USERNAME']!,
      merchantId: process.env['BPOINT_MERCHANT_ID']!,
      password: process.env['BPOINT_PASSWORD']!,
      apiRoot: process.env['BPOINT_API_ROOT']!,
    })
  })

  afterAll(async () => {
    Container.reset()
  })

  test('it places a once-off charge using credit card', async () => {
    const chargeObject = {
      ...fixtures.simpleCharge,
      Crn1: cryptoRandomString({ length: 49 }),
    }
    const simpleCharge = new ChargeDTO(chargeObject, fixtures.creditCard)
    const response: IBaseResponse = await api.placeCharge(simpleCharge)

    expect(validCodes).toContain(response.status)
  })

  test('it places a recurring charge using credit card', async () => {
    const chargeObject = {
      ...fixtures.simpleCharge,
      Crn1: cryptoRandomString({ length: 49 }),
      SubType: 'recurring' as const,
    }
    const simpleCharge = new ChargeDTO(chargeObject, fixtures.creditCard)
    const response: IBaseResponse = await api.placeCharge(simpleCharge)

    expect(validCodes).toContain(response.status)
  })

  test('it registers a customer with a credit card', async () => {
    const customerObject = {
      EmailAddress: 'test@example.com',
      Crn1: cryptoRandomString({ length: 49 }),
    }
    const customer = new CustomerDTO(customerObject, fixtures.creditCard)
    const response: IBaseResponse = await api.addCustomer(customer)

    expect(validCodes).toContain(response.status)
  })

  test('it can update a customer', async () => {
    const customerObject = {
      EmailAddress: 'test@example.com',
      Crn1: cryptoRandomString({ length: 49 }),
    }
    let customer = new CustomerDTO(customerObject, fixtures.creditCard)
    const createResponse: IBaseResponse = await api.addCustomer(customer)

    const reference = createResponse?.data?.DVTokenResp?.DVToken
    customerObject.EmailAddress = 'updatedemail@example.com'

    customer = new CustomerDTO(customerObject)
    const updateResponse: IBaseResponse = await api.updateCustomer(reference, customer)

    expect(validCodes).toContain(updateResponse.status)
  })
})
