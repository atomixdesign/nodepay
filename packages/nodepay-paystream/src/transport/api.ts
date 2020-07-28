import { Service, Inject, Container } from 'typedi'
import { AxiosInstance } from 'axios'
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

@Service('paystream.api')
export class PaystreamAPI {

  private httpClient: AxiosInstance

  constructor(
    @Inject('http.client') httpClientFactory: HttpClientFactory
  ) {
    const config: IPaystreamConfig = Container.get('paystream.config')

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
        url: '/credit_cards',
        data: creditCard,
      })
    } catch (error) {
      return Promise.reject(error)
    }

    if (!response.data.successful) {
      return Promise.reject(response.data.errors.toString())
    }

    return {
      status: response.status,
      statusText: response.statusText,
      data: response.data.response,
      originalResponse: response,
    }
  }

  async placeCharge(charge: ChargeDTO): Promise<IPaystreamAPIResponse> {
    let response
    try {
      response = await this.httpClient!.request({
        method: 'post',
        url: '/purchases',
        data: charge,
      })
    } catch (error) {
      return Promise.reject(error)
    }

    if (!response.data.successful) {
      return Promise.reject(response.data.errors.toString())
    }

    return {
      status: response.status,
      statusText: response.statusText,
      data: response.data.response,
      originalResponse: response,
    }
  }

  async schedulePayment(/* _schedule: PaymentScheduleDTO */): Promise<IPaystreamAPIResponse | undefined> {
    /* let response
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
    } */
    return
  }
}
