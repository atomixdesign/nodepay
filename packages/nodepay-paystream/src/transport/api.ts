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
  PlanDTO,
  CustomerDTO,
} from './dtos'
import { SubscriptionDTO } from './dtos/subscription'

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

  private async _process(endpoint: string, payload: any): Promise<IPaystreamAPIResponse> {
    let response
    try {
      response = await this.httpClient!.request({
        method: 'post',
        url: endpoint,
        data: payload,
      })
    } catch (error) {
      return Promise.reject({
        messages: error?.response?.data?.errors?.toString(),
        originalError: error,
      })
    }

    if (!response.data.successful) {
      return Promise.reject(response?.data?.errors?.toString())
    }

    return {
      status: response.status,
      statusText: response.statusText,
      data: response.data.response,
      originalResponse: response,
    }
  }

  async getCCtoken(creditCard: CreditCardDTO): Promise<IPaystreamAPIResponse> {
    return this._process('/credit_cards', creditCard)
  }

  async addCustomer(customer: CustomerDTO): Promise<IPaystreamAPIResponse> {
    return this._process('/customers', customer)
  }

  async addPlan(plan: PlanDTO): Promise<IPaystreamAPIResponse> {
    return this._process('/plans', plan)
  }

  async addSubscription(subscription: SubscriptionDTO): Promise<IPaystreamAPIResponse> {
    return this._process('/subscriptions', subscription)
  }

  async placeCharge(charge: ChargeDTO): Promise<IPaystreamAPIResponse> {
    return this._process('/purchases', charge)
  }
}
