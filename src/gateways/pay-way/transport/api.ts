// handles configurable retry
import { Service, Inject, Container } from 'typedi'
import { AxiosInstance, AxiosResponse } from 'axios'
import { v4 as uuidv4 } from 'uuid'
import qs from 'qs'
import { Config } from '../config'
import {
  HttpClientFactory,
} from '@atomixdesign/nodepay/network'
import {
  BankAccountDTO,
  ChargeDTO,
  CreditCardDTO,
  CustomerDTO,
  PaymentScheduleDTO,
} from '../dtos'

@Service('payway.api')
export class API {
  private idempotencyKey: string
  private secretAuthHeader: string
  private publicAuthHeader: string

  private httpClient: AxiosInstance

  constructor(
    @Inject('http.client') httpClientFactory: HttpClientFactory
  ) {
    const config: Config = Container.get('config')
    this.idempotencyKey = uuidv4()
    this.secretAuthHeader = `Basic ${this.encodeKey(config.secretKey)}`
    this.publicAuthHeader = `Basic ${this.encodeKey(config.publishableKey)}`

    this.httpClient = httpClientFactory.create({
      baseURL: config.apiRoot,
      headers: {
        Authorization: this.secretAuthHeader,
        Accept: `application/${config.responseType}`,
        'Idempotency-Key': this.idempotencyKey,
      }
    })
  }

  private encodeKey(key: string): string {
    return Buffer.from(key, 'binary').toString('base64')
  }

  // Verify key expiry/validity
  async verifyKey(): Promise<AxiosResponse> {
    const config: Config = Container.get('config')
    const response = await this.httpClient!.request({
      url: '/api-keys/latest',
    })
    if (response.status === 200) {
      if (response?.data.key !== config.secretKey) {
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

  async addCustomer(customer: CustomerDTO): Promise<AxiosResponse> {
    const payload = { ...customer }
    delete payload.customerNumber

    const response = await this.httpClient!.request({
      method: 'put',
      url: `/customers/${customer.customerNumber}`,
      data: qs.stringify({ ...payload }),
    })

    return response
  }

  async stopCustomerPayments(customerNumber: string): Promise<AxiosResponse> {
    const response = await this.httpClient!.request({
      method: 'patch',
      url: `/customers/${customerNumber}/payment-setup`,
      data: qs.stringify({ stopped: true }),
    })

    return response
  }

  async deleteCustomer(customerNumber: string): Promise<AxiosResponse> {
    await this.stopCustomerPayments(customerNumber)
    const response = await this.httpClient!.request({
      method: 'delete',
      url: `/customers/${customerNumber}`,
    })

    return response
  }

  async placeCharge(singleUseTokenId: string, charge: ChargeDTO): Promise<AxiosResponse> {
    const response = await this.httpClient!.request({
      method: 'post',
      url: '/transactions',
      data: qs.stringify({ singleUseTokenId, ...charge }),
    })

    return response
  }

  async placeDirectCharge(charge: ChargeDTO): Promise<AxiosResponse> {
    const response = await this.httpClient!.request({
      method: 'post',
      url: '/transactions',
      data: qs.stringify({ ...charge }),
    })

    return response
  }

  async schedulePayment(customerNumber: string, schedule: PaymentScheduleDTO): Promise<AxiosResponse> {
    const response = await this.httpClient!.request({
      method: 'put',
      url: `/customers/${customerNumber}/schedule`,
      data: qs.stringify({ ...schedule }),
    })

    return response
  }
}
