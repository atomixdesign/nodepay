import { Service, Inject, Container } from 'typedi'
import { AxiosInstance } from 'axios'
import qs from 'qs'
import { IPaystreamConfig } from '../types'
import {
  HttpClientFactory,
} from '@atomixdesign/nodepay-core/network'
import { IPaystreamAPIResponse } from './api-response'
import {
  ChargeDTO,
  CreditCardDTO,
  // PaymentScheduleDTO,
} from './dtos'

@Service('payway.api')
export class PaystreamAPI {

  private httpClient: AxiosInstance

  constructor(
    @Inject('http.client') httpClientFactory: HttpClientFactory
  ) {
    const config: IPaystreamConfig = Container.get('payway.config')

    this.httpClient = httpClientFactory.create({
      baseURL: config.apiRoot,
      auth: {
        username: config.username,
        password: config.apiKey,
      },
    })
  }

  async getCCtoken(creditCard: CreditCardDTO): Promise<IPaystreamAPIResponse> {
    let response
    try {
      response = await this.httpClient!.request({
        method: 'post',
        url: '/single-use-tokens',
        data: qs.stringify({ ...creditCard }),
      })
    } catch (error) {
      return Promise.reject(error)
    }

    if (!response.data.successful) {
      return Promise.reject(response.data.error.toString())
    }

    return {
      status: response.status,
      statusText: response.statusText,
      data: response.data.response,
      originalResponse: response,
    }
  }

  async placeCharge(charge: ChargeDTO): Promise<IPaystreamAPIResponse | undefined> {
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

    if (!response.data.successful) {
      return Promise.reject(response.data.error.toString())
    }

    return {
      status: response.status,
      statusText: response.statusText,
      data: response.data.response,
      originalResponse: response,
    }
  }
}
