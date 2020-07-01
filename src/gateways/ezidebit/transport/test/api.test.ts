import { Container } from 'typedi'
import { API as EzidebitTransport } from '../api'

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
    // const creditCard = new CreditCardDTO(fixtures.creditCard)
    // const ccResponse: AxiosResponse = await api.getCCtoken(creditCard)
    // const onceOffCharge = new ChargeDTO(fixtures.onceOffCharge)
    // const response: AxiosResponse = await api.placeCharge(ccResponse?.data.singleUseTokenId, onceOffCharge)
    // expect(validCodes).toContain(response.status)
  }, 60000)
})
