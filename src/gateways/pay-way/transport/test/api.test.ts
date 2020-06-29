import { API } from '../api'
import { AxiosResponse } from 'axios'
import {
  BankAccountDTO,
  ChargeDTO,
  CreditCardDTO,
} from '../../dtos'

const fixtures = {
  creditCard: {
    cardNumber: '4564710000000004',
    cardholderName: 'John Doe',
    cvn: '847',
    expiryDateMonth: '02',
    expiryDateYear: '29'
  },
  bankAccount: {
    bsb: '650-000',
    accountNumber: '999994',
    accountName: 'John Doe',
  },
  onceOffCharge: {
    customerNumber: '987654321',
    principalAmount: 10.87,
    orderNumber: '123456789',
    customerIpAddress: '169.254.169.254',
    merchantId: 'TEST',
  },
}

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

  // See: https://www.payway.com.au/docs/net.html#test-card-numbers
  test('it retrieves a single use token for the credit card', async () => {
    const creditCard = new CreditCardDTO(fixtures.creditCard)
    const response: AxiosResponse = await api.getCCtoken(creditCard)
    expect(response.status).toBe(200)
  })

  // See: https://quickstream.westpac.com.au/docs/general/test-account-numbers/#test-bank-accounts
  test('it retrieves a single use token for the bank account', async () => {
    const bankAccount = new BankAccountDTO(fixtures.bankAccount)
    const response: AxiosResponse = await api.getBankAccountToken(bankAccount)
    expect(response.status).toBe(200)
  })

  test('it places a once-off charge using credit card', async () => {
    const creditCard = new CreditCardDTO(fixtures.creditCard)
    const ccResponse: AxiosResponse = await api.getCCtoken(creditCard)
    const onceOffCharge = new ChargeDTO(fixtures.onceOffCharge)
    const response: AxiosResponse = await api.placeCharge(ccResponse?.data.singleUseTokenId, onceOffCharge)
    expect(response.status).toBe(201)
  }, 60000)

})
