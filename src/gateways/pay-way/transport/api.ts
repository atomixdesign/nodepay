// handles configurable retry
import axios, { AxiosResponse } from 'axios'
import qs from 'qs'
import { v4 as uuidv4 } from 'uuid'
import { Config } from '../config'
import { BaseAPI } from '../../../network/base-api'
import {
  BankAccountDTO,
  CreditCardDTO,
} from '../dtos'

export class API extends BaseAPI {
  private config: Config
  private idempotencyKey: string
  private secretAuthHeader: string
  private publicAuthHeader: string

  constructor(config: Config) {
    super()
    this.config = config
    this.idempotencyKey = uuidv4()
    const encodedSecretKey: string = Buffer.from(config.secretKey, 'binary').toString('base64')
    this.secretAuthHeader = `Basic ${encodedSecretKey}`
    const encodedPublicKey: string = Buffer.from(config.publishableKey, 'binary').toString('base64')
    this.publicAuthHeader = `Basic ${encodedPublicKey}`

    this.httpClient = axios.create({
      baseURL: this.config.apiRoot,
      headers: {
        Authorization: this.secretAuthHeader,
        Accept: `application/${this.config.responseType}`,
        'Idempotency-Key': this.idempotencyKey, // TODO: persist the idempotency key/ensure close coupling with request signature
      }
    })
    this.registerLogger()
  }

  // Verify key expiry/validity
  async verifyKey(): Promise<AxiosResponse> {
    const response = await this.httpClient!.request({
      url: '/api-keys/latest',
    })
    if (response.status === 200) {
      if (response?.data.key !== this.config.secretKey) {
        console.error('Payway API key is about to expire. Please log in to your Payway admin and generate a new api key.')
      }
    }
    return response
  }

  async getCCtoken(creditCard: CreditCardDTO): Promise<AxiosResponse> {
    const response = await this.httpClient!.request({
      method: 'post',
      url: '/single-use-tokens',
      data: qs.stringify({ ...creditCard }),
      headers: {
        Authorization: this.publicAuthHeader,
      }
    })

    return response
  }

  async getBankAccountToken(bankAccount: BankAccountDTO): Promise<AxiosResponse> {
    const response = await this.httpClient!.request({
      method: 'post',
      url: '/single-use-tokens',
      data: qs.stringify({ ...bankAccount }),
      headers: {
        Authorization: this.publicAuthHeader,
      }
    })

    return response
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
