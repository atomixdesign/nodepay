import { Container } from 'typedi'
// import moment from 'moment'
import { PaystreamAPI as PaystreamTransport } from '../api'
import { IPaystreamAPIResponse } from '../api-response'
import {
  ChargeDTO,
  CreditCardDTO,
} from '../dtos'

const validCodes = [
  200,
  201,
]

const fixtures = {
  creditCard: {
    cardNumber: '5123456789012346',
    cardHolderName: 'John Doe',
    CCV: '847',
    expiryDateMonth: '02',
    expiryDateYear: '2029'
  },
  bankAccount1: {
    BSBNumber: '650-000',
    accountNumber: '999994',
    accountName: 'John Doe',
  },
  onceOffCharge: {
    amountInCents: 1087,
    orderNumber: '123456789',
    customerIp: '169.254.169.254',
  },
}

describe('test paystream api transport', () => {
  let api: PaystreamTransport

  beforeAll(() => {
    Container.set('paystream.config', {
      username: process.env['PAYSTREAM_USERNAME']!,
      apiKey: process.env['PAYSTREAM_API_KEY']!,
      apiRoot: process.env['PAYSTREAM_API_ROOT']!,
    })
    api = Container.get(PaystreamTransport)
  })

  // See: https://www.payway.com.au/docs/net.html#test-card-numbers
  test('it retrieves a single use token for the credit card', async () => {
    const creditCard = new CreditCardDTO(fixtures.creditCard)
    const response: IPaystreamAPIResponse = await api.getCCtoken(creditCard)
    expect(validCodes).toContain(response.status)
    expect(response?.originalResponse?.data?.successful).toBe(true)
  })

  test('it places a once-off charge using credit card', async () => {
    const chargeObject = { ...fixtures.onceOffCharge, creditCard: fixtures.creditCard }
    const onceOffCharge = new ChargeDTO(chargeObject)
    console.log(chargeObject, onceOffCharge)
    const response: IPaystreamAPIResponse = await api.placeCharge(onceOffCharge)

    expect(validCodes).toContain(response.status)
    expect(response?.originalResponse?.data?.successful).toBe(true)
  })
})
