import { Container } from 'typedi'
import { AxiosResponse } from 'axios'
import moment from 'moment'
import { PaywayAPI as PayWayTransport } from '../api'
import { IPaywayAPIResponse } from '../api-response'
import { PaywayPaymentFrequency } from '../../types'
import {
  BankAccountDTO,
  ChargeDTO,
  CreditCardDTO,
  CustomerDTO,
  PaymentScheduleDTO,
} from '../dtos'

const validCodes = [
  200,
  201,
]

const fixtures = {
  creditCard: {
    cardNumber: '4564710000000004',
    cardHolderName: 'John Doe',
    CCV: '847',
    expiryDateMonth: '02',
    expiryDateYear: '29'
  },
  bankAccount1: {
    BSBNumber: '650-000',
    accountNumber: '999994',
    accountName: 'John Doe',
  },
  /* bankAccountForDebit: {
    bsb: '000-000',
  }, */
  onceOffCharge: {
    customerNumber: 'onceoffCustomer',
    principalAmount: 10.87,
    orderNumber: '123456789',
    customerIpAddress: '169.254.169.254',
    merchantId: 'TEST',
  },
  directDebitCharge: {
    customerNumber: 'customerWithBanking',
    principalAmount: 22.37,
    orderNumber: '123456789',
    customerIpAddress: '169.254.169.254',
  },
  customerWithCC: {
    customerNumber: 'customerWithCC',
    merchantId: 'TEST',
  },
  customerWithBanking: {
    customerNumber: 'customerWithBanking',
    merchantId: 'TEST',
    bankAccountId: '0000000A'
  },
  schedule: {
    frequency: PaywayPaymentFrequency.Weekly,
    nextPaymentDate: moment().add(2, 'days').format('D MMM YYYY'),
    regularPrincipalAmount: 17.89,
  },
}

describe('test payway api transport', () => {
  let api: PayWayTransport

  beforeAll(() => {
    Container.set('payway.config', {
      secretKey: process.env['PAYWAY_TEST_SECRET_KEY']!,
      publishableKey: process.env['PAYWAY_TEST_PUBLISHABLE_KEY']!,
      apiRoot: process.env['PAYWAY_API_ROOT']!,
      responseType: 'json'
    })
    api = Container.get(PayWayTransport)
  })

  afterAll(async () => {
    await api.deleteCustomer(fixtures.customerWithCC.customerNumber)
    // TODO: 'Could not delete customer because they have made payments in the past 220 days.'
    await api.deleteCustomer(fixtures.customerWithBanking.customerNumber)
    Container.reset()
  })

  test('it verifies the key validity', async () => {
    const response: AxiosResponse = await api.verifyKey()
    expect(validCodes).toContain(response.status)
  })

  // See: https://www.payway.com.au/docs/net.html#test-card-numbers
  test('it retrieves a single use token for the credit card', async () => {
    const creditCard = new CreditCardDTO(fixtures.creditCard)
    const response: AxiosResponse = await api.getCCtoken(creditCard)
    expect(validCodes).toContain(response.status)
  })

  // See: https://quickstream.westpac.com.au/docs/general/test-account-numbers/#test-bank-accounts
  test('it retrieves a single use token for the bank account', async () => {
    const bankAccount = new BankAccountDTO(fixtures.bankAccount1)
    const response: AxiosResponse = await api.getBankAccountToken(bankAccount)
    expect(validCodes).toContain(response.status)
  })

  test('it places a once-off charge using credit card', async () => {
    const creditCard = new CreditCardDTO(fixtures.creditCard)
    const ccResponse: AxiosResponse = await api.getCCtoken(creditCard)
    const onceOffCharge = new ChargeDTO(fixtures.onceOffCharge)
    const response: IPaywayAPIResponse = await api.placeCharge(ccResponse?.data.singleUseTokenId, onceOffCharge)

    expect(validCodes).toContain(response.status)
  })

  test('it adds a customer using a credit card', async () => {
    const creditCard = new CreditCardDTO(fixtures.creditCard)
    const ccResponse: AxiosResponse = await api.getCCtoken(creditCard)
    const customer = new CustomerDTO({
      singleUseTokenId: ccResponse?.data.singleUseTokenId,
      customerNumber: fixtures.customerWithCC.customerNumber,
      merchantId: fixtures.customerWithCC.merchantId,
    })
    const response: AxiosResponse = await api.addCustomer(customer)
    expect(validCodes).toContain(response.status)
  })

  test('it adds a customer using a bank account', async () => {
    const bankAccount = new BankAccountDTO(fixtures.bankAccount1)
    const bankingResponse: AxiosResponse = await api.getBankAccountToken(bankAccount)
    const customer = new CustomerDTO({
      singleUseTokenId: bankingResponse?.data.singleUseTokenId,
      customerNumber: fixtures.customerWithBanking.customerNumber,
      merchantId: fixtures.customerWithBanking.merchantId,
      bankAccountId: fixtures.customerWithBanking.bankAccountId,
    })
    const response: AxiosResponse = await api.addCustomer(customer)
    expect(validCodes).toContain(response.status)
  })

  test('it places a direct debit charge using bank account', async () => {
    const bankAccount = new BankAccountDTO(fixtures.bankAccount1)
    const bankingResponse: AxiosResponse = await api.getBankAccountToken(bankAccount)
    const customer = new CustomerDTO({
      singleUseTokenId: bankingResponse?.data.singleUseTokenId,
      customerNumber: fixtures.customerWithBanking.customerNumber,
      merchantId: fixtures.customerWithBanking.merchantId,
      bankAccountId: fixtures.customerWithBanking.bankAccountId,
    })
    await api.addCustomer(customer)
    const directDebitCharge = new ChargeDTO(fixtures.directDebitCharge)
    const response: IPaywayAPIResponse = await api.placeDirectCharge(directDebitCharge)
    expect(validCodes).toContain(response.status)
  })

  test('it places a recurring charge using bank account', async () => {
    const bankAccount = new BankAccountDTO(fixtures.bankAccount1)
    const bankingResponse: AxiosResponse = await api.getBankAccountToken(bankAccount)
    const { customerNumber } = fixtures.customerWithBanking
    const customer = new CustomerDTO({
      singleUseTokenId: bankingResponse?.data.singleUseTokenId,
      customerNumber,
      merchantId: fixtures.customerWithBanking.merchantId,
      bankAccountId: fixtures.customerWithBanking.bankAccountId,
    })
    await api.addCustomer(customer)
    const paymentSchedule = new PaymentScheduleDTO(fixtures.schedule)
    const response: IPaywayAPIResponse = await api.schedulePayment(customerNumber, paymentSchedule)
    expect(validCodes).toContain(response.status)
  })

})
