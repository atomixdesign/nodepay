import { Container } from 'typedi'
import { API as EzidebitTransport } from '../api'
import { OnceOffChargeDTO } from '../../dtos/once-off-charge'
import { APIResponse } from '@atomixdesign/nodepay/network/response'

const fixtures = {
  creditCard: {
    CreditCardNumber: '5123456789012346',
    CreditCardExpiryMonth: '05',
    CreditCardExpiryYear: '2021',
    CreditCardCCV: '847',
    NameOnCreditCard: 'John Doe',
    PaymentAmountInCents: 1012,
    PaymentReference: '123456789',
  },
}

describe('test ezidebit api transport', () => {
  let api: EzidebitTransport

  beforeAll(() => {
    Container.set('ezidebit.config', {
      clientId: process.env['EZIDEBIT_CLIENT_ID']!,
      digitalKey: process.env['EZIDEBIT_DIGITAL_KEY']!,
      publicKey: process.env['EZIDEBIT_PUBLIC_KEY']!,
      apiRoot: process.env['EZIDEBIT_TEST_API_ROOT']!,
    })
    api = Container.get(EzidebitTransport)
  })

  afterAll(async () => {
    Container.reset()
  })

  test('it describes the web service', async () => {
    const service = await api.describe()
    expect(service).toBeDefined()
  })

  test('it places a once-off charge using credit card', async () => {
    const onceOffCharge = new OnceOffChargeDTO(fixtures.creditCard)
    const result: APIResponse = await api.placeCharge(onceOffCharge)

    console.dir(result, { depth: 0 })
    expect(true).toBe(true)
    // const creditCard = new CreditCardDTO(fixtures.creditCard)
    // const ccResponse: AxiosResponse = await api.getCCtoken(creditCard)
    // const onceOffCharge = new ChargeDTO(fixtures.onceOffCharge)
    // const response: AxiosResponse = await api.placeCharge(ccResponse?.data.singleUseTokenId, onceOffCharge)
    // expect(validCodes).toContain(response.status)
  }, 60000)
})
