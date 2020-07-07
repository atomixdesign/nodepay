import { Container } from 'typedi'
// import { AxiosResponse } from 'axios'
// import moment from 'moment'
import cryptoRandomString from 'crypto-random-string'
import { API as BpointTransport } from '../api'
import { APIResponse } from '../api-response'
import { ActionType, Currency, TransactionType, } from '../../types'
import {
  ChargeDTO, CreditCardDTO,
} from '../dtos'

const fixtures = {
  creditCard: {
    CardHolderName: 'John Doe',
    CardNumber: '5123456789012346',
    Cvn: '123',
    ExpiryDate: '0521',
  },
  simpleCharge: {
    Action: ActionType.payment,
    Amount: 100,
    CardDetails: undefined,
    Currency: Currency.AUD,
    Crn1: '',
    SubType: 'single' as const,
    TestMode: true,
    Type: TransactionType.ecommerce,
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
    const response: APIResponse = await api.placeCharge(simpleCharge)

    expect(validCodes).toContain(response.status)
  })

})
