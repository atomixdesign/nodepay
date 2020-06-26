import { API } from '../api'
import { AxiosResponse } from 'axios'

describe('test payway api transport', () => {
  let api: API

  beforeEach(() => {
    api = new API({
      apiKey: process.env['PAYWAY_KEY']!,
      apiRoot: process.env['PAYWAY_ROOT']!,
      responseType: 'json'
    })
  })

  test('the key validity is verified', async () => {
    const response: AxiosResponse = await api.verifyKey()
    expect(response.status).toBe(200)
  })
})
