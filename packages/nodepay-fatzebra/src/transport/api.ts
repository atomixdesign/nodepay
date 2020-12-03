import { Service } from 'typedi'
import { AxiosInstance } from 'axios'
import { FatzebraConfig } from '../types'
import {
  HttpClientFactory,
} from '@atomixdesign/nodepay-core/build/network'
import { IFatzebraAPIResponse } from './api-response'
import {
  ChargeDTO,
  CreditCardDTO,
  CustomerDTO,
  BankAccountDTO,
} from './dtos'
import { PaymentPlanDTO } from './dtos/payment-plan'
import { DirectDebitDTO } from './dtos/direct-debit'

@Service()
export class FatzebraAPI {

  private httpClient: AxiosInstance

  constructor(
    private config: FatzebraConfig,
  ) {
    const httpClientFactory: HttpClientFactory = new HttpClientFactory()

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

  async getCustomer(reference: string): Promise<IFatzebraAPIResponse> {
    return this._get(`/customers/${reference}`)
  }

  async addCustomer(customer: CustomerDTO): Promise<IFatzebraAPIResponse> {
    return this._post('/customers', customer)
  }

  async updateCustomer(reference: string, customer: CustomerDTO): Promise<IFatzebraAPIResponse> {
    return this._put(`/customers/${reference}.json`, customer)
  }

  async addDirectDebit(directDebit: DirectDebitDTO): Promise<IFatzebraAPIResponse> {
    return this._post('/direct_debits', directDebit)
  }

  async addPaymentPlan(subscription: PaymentPlanDTO): Promise<IFatzebraAPIResponse> {
    return this._post('/payment_plans', subscription)
  }

  async placeCharge(charge: ChargeDTO): Promise<IFatzebraAPIResponse> {
    return this._post('/purchases', charge)
  }
}
