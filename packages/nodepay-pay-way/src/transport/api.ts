// handles configurable retry
import { Service, Inject, Container } from 'typedi'
import { AxiosInstance, AxiosResponse } from 'axios'
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
  async verifyKey(): Promise<AxiosResponse> {
    const config: IPaywayConfig = Container.get('payway.config')
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

    return response
  }

  async getBankAccountToken(bankAccount: BankAccountDTO): Promise<AxiosResponse> {
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

    return response
  }

  async addCustomer(customer: CustomerDTO): Promise<AxiosResponse> {
    const payload = { ...customer }
    delete payload.customerNumber

    let response
    try {
      response = await this.httpClient!.request({
        method: 'put',
        url: `/customers/${customer.customerNumber}`,
        data: qs.stringify({ ...payload }),
      })
    } catch (error) {
      return Promise.reject(error)
    }

    return response
  }

  async stopCustomerPayments(customerNumber: string): Promise<AxiosResponse> {
    let response
    try {
      response = await this.httpClient!.request({
        method: 'patch',
        url: `/customers/${customerNumber}/payment-setup`,
        data: qs.stringify({ stopped: true }),
      })
    } catch (error) {
      return Promise.reject(error)
    }

    return response
  }

  async deleteCustomer(customerNumber: string): Promise<AxiosResponse> {
    let response
    try {
      await this.stopCustomerPayments(customerNumber)
      response = await this.httpClient!.request({
        method: 'delete',
        url: `/customers/${customerNumber}`,
      })
    } catch (error) {
      return Promise.reject(error)
    }

    return response
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

  async schedulePayment(customerNumber: string, schedule: PaymentScheduleDTO): Promise<IPaywayAPIResponse> {
    let response
    try {
      response = await this.httpClient!.request({
        method: 'put',
        url: `/customers/${customerNumber}/schedule`,
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
