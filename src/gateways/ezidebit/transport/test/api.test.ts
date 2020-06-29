import { API } from '../api'

describe('test ezidebit api transport', () => {
  let api: API

  beforeEach(() => {
    api = new API({
      clientId: process.env['EZIDEBIT_CLIENT_ID']!,
      digitalKey: process.env['EZIDEBIT_DIGITAL_KEY']!,
      publicKey: process.env['EZIDEBIT_PUBLIC_KEY']!,
      apiRoot: process.env['EZIDEBIT_TEST_API_ROOT']!,
    })
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
