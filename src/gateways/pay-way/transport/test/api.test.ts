import { API } from '../api'
import { AxiosResponse } from 'axios'
import { CreditCardDTO } from '../../dtos'

describe('test payway api transport', () => {
  let api: API

  beforeEach(() => {
    api = new API({
      secretKey: process.env['PAYWAY_SECRET_KEY']!,
      publishableKey: process.env['PAYWAY_PUBLISHABLE_KEY']!,
      apiRoot: process.env['PAYWAY_ROOT']!,
      responseType: 'json'
    })
  })

  test('the key validity is verified', async () => {
    const response: AxiosResponse = await api.verifyKey()
    expect(response.status).toBe(200)
  })

  test('the credit card returns a single use token', async () => {
    const creditCard = new CreditCardDTO({
      cardNumber: '4564710000000004',
      cardholderName: 'John Doe',
      cvn: '847',
      expiryDateMonth: '02',
      expiryDateYear: '29'
    })
    const response: AxiosResponse = await api.getCCtoken(creditCard)
    expect(response.status).toBe(200)
  })
})
