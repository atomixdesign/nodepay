// handles configurable retry
import axios, { AxiosInstance, AxiosResponse } from 'axios'
import { v4 as uuidv4 } from 'uuid'
import { Config } from '../config'

export class API {
  private config: Config
  private idempotencyKey: string
  private authHeader: string
  private httpClient: AxiosInstance

  constructor(config: Config) {
    this.config = config
    this.idempotencyKey = uuidv4()
    const encodedAuth: string = Buffer.from(config.apiKey, 'binary').toString('base64')
    this.authHeader = `Basic ${encodedAuth}`

    this.httpClient = axios.create({
      baseURL: this.config.apiRoot,
      headers: {
        Authorization: this.authHeader,
        Accept: `application/${this.config.responseType}`,
        'Idempotency-Key': this.idempotencyKey, // TODO: persist the idempotency key/ensure close coupling with request signature
      }
    })
  }

  // Verify key expiry/validity
  async verifyKey(): Promise<AxiosResponse> {
    const response = await this.httpClient.request({
      url: '/api-keys/latest',
    })
    if (response.status === 200) {
      if (response?.data.key !== this.config.apiKey) {
        console.error('Payway API key is about to expire. Please log in to your Payway admin and generate a new api key.')
      }
    }
    return response
  }

  getCCtoken(): string {
    return ''
  }

  getBankAccountToken(): string {
    return ''
  }

  addCustomer(customerNumber?: string): string | undefined {
    return customerNumber
  }

  placeCharge(/* singleUseTokenId?: string, charge: ChargeDTO */): boolean {
    return false
  }

  schedulePayment(/* customerNumber: string, schedule: PaymentScheduleDTO */): boolean {
    return false
  }
}
