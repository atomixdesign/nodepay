/**
 * This file is used to run integration tests for the adapter's
 * private interface (the payment gateway).
 * */

import { Container } from 'typedi'
import { AxiosResponse } from 'axios'
import { API as SampleTransport } from '../api'
import { APIResponse } from '../api-response'

const validCodes = [
  200,
  201,
]

const fixtures = {
  creditCard: {
    cardNumber: '0000000000000000',
    cardholderName: 'Test User',
    cvn: '847',
    expiryDateMonth: '02',
    expiryDateYear: '31'
  },
  onceOffCharge: {
    customerId: 'onceoffCustomer',
    principalAmount: 10.87,
    orderNumber: '123456789',
  },
}

describe('test sample api transport', () => {
  let api: SampleTransport

  beforeAll(() => {
    // Use sandbox environment parameters
    Container.set('sample.config', {
      secretKey: process.env['API_SECRET_KEY']!,
      apiRoot: process.env['API_URL']!,
    })
    api = Container.get(SampleTransport)
  })

  afterAll(async () => {
    // Perform all cleanup here
    Container.reset()
  })

  test('it places a once-off charge using credit card', async () => {
    const { creditCard, onceOffCharge } = fixtures
    // marshall the charge object if additional data is necessary, ie.
    // const ccResponse: AxiosResponse = await api.getCreditCardToken(creditCard)
    const response: APIResponse = await api.placeCharge(onceOffCharge)
    expect(validCodes).toContain(response.status)
  })
})
