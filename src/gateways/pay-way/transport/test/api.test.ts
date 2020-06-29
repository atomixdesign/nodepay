import { API } from '../api'
import { AxiosResponse } from 'axios'
import {
  BankAccountDTO,
  CreditCardDTO,
} from '../../dtos'

describe('test payway api transport', () => {
  let api: API

  beforeEach(() => {
    api = new API({
      secretKey: process.env['PAYWAY_TEST_SECRET_KEY']!,
      publishableKey: process.env['PAYWAY_TEST_PUBLISHABLE_KEY']!,
      apiRoot: process.env['PAYWAY_API_ROOT']!,
      responseType: 'json'
    })
  })

  test('it verifies the key validity', async () => {
    const response: AxiosResponse = await api.verifyKey()
    expect(response.status).toBe(200)
  })

  test('it retrieves a single use token for the credit card', async () => {
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

  test('it retrieves a single use token for the bank account', async () => {
    const bankAccount = new BankAccountDTO({
      bsb: '650-000',
      accountNumber: '999994',
      accountName: 'John Doe',
    })
    const response: AxiosResponse = await api.getBankAccountToken(bankAccount)
    expect(response.status).toBe(200)
  })
})
