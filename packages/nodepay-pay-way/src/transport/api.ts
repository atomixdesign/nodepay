// handles configurable retry
import { Service, Inject, Container } from 'typedi'
import { AxiosInstance } from 'axios'
import { v4 as uuidv4 } from 'uuid'
import qs from 'qs'
import { IPaywayConfig } from '../types'
import {
  HttpClientFactory,
} from '@atomixdesign/nodepay-core/network'
import { IPaywayAPIResponse } from './api-response'
import {
  BankAccountDTO,
  ChargeDTO,
  CreditCardDTO,
  CustomerDTO,
  PaymentScheduleDTO,
} from './dtos'

@Service('payway.api')
export class PaywayAPI {
  private idempotencyKey: string
  private secretAuthHeader: string
  private publicAuthHeader: string

  private httpClient: AxiosInstance

  constructor(
    @Inject('http.client') httpClientFactory: HttpClientFactory
  ) {
    const config: IPaywayConfig = Container.get('payway.config')
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
  async verifyKey(): Promise<IPaywayAPIResponse> {
    const config: IPaywayConfig = Container.get('payway.config')
    const response = await this.httpClient!.request({
      url: '/api-keys/latest',
    })
    if (response.status === 200) {
      if (response?.data.key !== config.secretKey) {
        console.error('Payway API key is about to expire. Please log in to your Payway admin and generate a new api key.')
      }
    }
    return {
      status: response.status,
      statusText: response.statusText,
      data: response.data,
      originalResponse: response,
    }
  }

  async getCCtoken(creditCard: CreditCardDTO): Promise<IPaywayAPIResponse> {
    let response
    try {
      response = await this.httpClient!.request({
        method: 'post',
        url: '/single-use-tokens',
        data: qs.stringify({ ...creditCard }),
        headers: {
          Authorization: this.publicAuthHeader,
        }
      })
    } catch (error) {
      return Promise.reject(error)
    }

    return {
      status: response.status,
      statusText: response.statusText,
      data: response.data,
      originalResponse: response,
    }
  }

  async getBankAccountToken(bankAccount: BankAccountDTO): Promise<IPaywayAPIResponse> {
    let response
    try {
      response = await this.httpClient!.request({
        method: 'post',
        url: '/single-use-tokens',
        data: qs.stringify({ ...bankAccount }),
        headers: {
          Authorization: this.publicAuthHeader,
        }
      })
    } catch (error) {
      return Promise.reject(error)
    }

    return {
      status: response.status,
      statusText: response.statusText,
      data: response.data,
      originalResponse: response,
    }
  }

  async addCustomer(customer: CustomerDTO): Promise<IPaywayAPIResponse> {
    const payload = { ...customer }
    delete payload.customerId

    let response
    try {
      response = await this.httpClient!.request({
        method: 'put',
        url: `/customers/${customer.customerId}`,
        data: qs.stringify({ ...payload }),
      })
    } catch (error) {
      return Promise.reject(error)
    }

    return {
      status: response.status,
      statusText: response.statusText,
      data: response.data,
      originalResponse: response,
    }
  }

  async stopCustomerPayments(customerId: string): Promise<IPaywayAPIResponse> {
    let response
    try {
      response = await this.httpClient!.request({
        method: 'patch',
        url: `/customers/${customerId}/payment-setup`,
        data: qs.stringify({ stopped: true }),
      })
    } catch (error) {
      return Promise.reject(error)
    }

    return {
      status: response.status,
      statusText: response.statusText,
      data: response.data,
      originalResponse: response,
    }
  }

  async deleteCustomer(customerId: string): Promise<IPaywayAPIResponse> {
    let response
    try {
      await this.stopCustomerPayments(customerId)
      response = await this.httpClient!.request({
        method: 'delete',
        url: `/customers/${customerId}`,
      })
    } catch (error) {
      return Promise.reject(error)
    }

    return {
      status: response.status,
      statusText: response.statusText,
      data: response.data,
      originalResponse: response,
    }
  }

  async placeCharge(singleUseTokenId: string, charge: ChargeDTO): Promise<IPaywayAPIResponse> {
    let response
    try {
      response = await this.httpClient!.request({
        method: 'post',
        url: '/transactions',
        data: qs.stringify({ singleUseTokenId, ...charge }),
      })
    } catch (error) {
      return Promise.reject(error)
    }

    return {
      status: response.status,
      statusText: response.statusText,
      data: response.data,
      originalResponse: response,
    }
  }

  async placeDirectCharge(charge: ChargeDTO): Promise<IPaywayAPIResponse> {
    let response
    try {
      response = await this.httpClient!.request({
        method: 'post',
        url: '/transactions',
        data: qs.stringify({ ...charge }),
      })
    } catch (error) {
      return Promise.reject(error)
    }

    return {
      status: response.status,
      statusText: response.statusText,
      data: response.data,
      originalResponse: response,
    }
  }

  async schedulePayment(customerId: string, schedule: PaymentScheduleDTO): Promise<IPaywayAPIResponse> {
    let response
    try {
      response = await this.httpClient!.request({
        method: 'put',
        url: `/customers/${customerId}/schedule`,
        data: qs.stringify({ ...schedule }),
      })
    } catch (error) {
      return Promise.reject(error)
    }

    return {
      status: response.status,
      statusText: response.statusText,
      data: response.data,
      originalResponse: response,
    }
  }
}
