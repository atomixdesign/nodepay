import { Service, Inject, Container } from 'typedi'
import { AxiosInstance } from 'axios'
import { FatzebraConfig } from '../types'
import {
  HttpClientFactory,
} from '@atomixdesign/nodepay-core/build/network'
import { IFatzebraAPIResponse } from './api-response'
import {
  ChargeDTO,
  CreditCardDTO,
  PlanDTO,
  CustomerDTO,
  BankAccountDTO,
} from './dtos'
import { SubscriptionDTO } from './dtos/subscription'

@Service('fatzebra.api')
export class FatzebraAPI {

  private httpClient: AxiosInstance

  constructor(
    @Inject('http.client') httpClientFactory: HttpClientFactory
  ) {
    const config: FatzebraConfig = Container.get('fatzebra.config')

    this.httpClient = httpClientFactory.create({
      baseURL: config.apiRoot,
      auth: {
        username: config.username,
        password: config.apiKey,
      },
    })
  }

  private async _request(method: 'get' | 'put' | 'post', endpoint: string, payload: any): Promise<IFatzebraAPIResponse> {
    let response
    try {
      response = await this.httpClient!.request({
        method,
        url: endpoint,
        data: payload,
      })
    } catch (error) {
      throw new Error(error?.response?.data?.errors?.toString())
    }

    if (!response.data.successful) {
      throw new Error(response?.data?.errors?.toString())
    }

    return {
      status: response.status,
      statusText: response.statusText,
      data: response.data.response,
      originalResponse: response,
    }
  }

  private async _get(endpoint: string, payload?: any): Promise<IFatzebraAPIResponse> {
    return this._request('get', endpoint, payload)
  }

  private async _put(endpoint: string, payload: any): Promise<IFatzebraAPIResponse> {
    return this._request('put', endpoint, payload)
  }

  private async _post(endpoint: string, payload: any): Promise<IFatzebraAPIResponse> {
    return this._request('post', endpoint, payload)
  }

  async getCCtoken(creditCard: CreditCardDTO): Promise<IFatzebraAPIResponse> {
    return this._post('/credit_cards', creditCard)
  }

  async getBankAccountToken(bankAccount: BankAccountDTO): Promise<IFatzebraAPIResponse> {
    return this._post('/bank_accounts', bankAccount)
  }

  async addCustomer(customer: CustomerDTO): Promise<IFatzebraAPIResponse> {
    return this._post('/customers', customer)
  }

  async updateCustomer(reference: string, customer: CustomerDTO): Promise<IFatzebraAPIResponse> {
    return this._put(`/customers/${reference}.json`, customer)
  }

  async listPlans(): Promise<IFatzebraAPIResponse> {
    return this._get('/plans')
  }

  async addPlan(plan: PlanDTO): Promise<IFatzebraAPIResponse> {
    return this._post('/plans', plan)
  }

  async addSubscription(subscription: SubscriptionDTO): Promise<IFatzebraAPIResponse> {
    return this._post('/subscriptions', subscription)
  }

  async placeCharge(charge: ChargeDTO): Promise<IFatzebraAPIResponse> {
    return this._post('/purchases', charge)
  }
}
