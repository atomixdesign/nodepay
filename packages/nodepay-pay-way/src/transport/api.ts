import { Service } from 'typedi'
import { AxiosInstance } from 'axios'
import { v4 as uuidv4 } from 'uuid'
import qs from 'qs'
import { PaywayConfig } from '../types'
import {
  HttpClientFactory,
} from '@atomixdesign/nodepay-core/build/network'
import { IPaywayAPIResponse } from './api-response'
import {
  BankAccountDTO,
  ChargeDTO,
  CreditCardDTO,
  CustomerDTO,
  PaymentScheduleDTO,
  AddressDTO,
  PaymentDetailsDTO,
} from './dtos'


@Service()
export class PaywayAPI {
  private idempotencyKey: string
  private secretAuthHeader: string
  private publicAuthHeader: string

  private httpClient: AxiosInstance

  constructor(
    private config: PaywayConfig,
  ) {
    const httpClientFactory: HttpClientFactory = new HttpClientFactory()

    this.idempotencyKey = uuidv4()
    this.secretAuthHeader = `Basic ${this.encodeKey(config.secretKey)}`
    this.publicAuthHeader = `Basic ${this.encodeKey(config.publishableKey)}`

    this.httpClient = httpClientFactory.create({
      baseURL: config.apiRoot,
      headers: {
        Authorization: this.secretAuthHeader,
        Accept: `application/${config.responseType}`,
        'Idempotency-Key': this.idempotencyKey,
      },
    })
  }

  private encodeKey(key: string): string {
    return Buffer.from(key, 'binary').toString('base64')
  }

  private async _process(requestConfig: any): Promise<IPaywayAPIResponse> {
    const response = await this.httpClient!.request(requestConfig)

    return {
      status: response.status,
      statusText: response.statusText,
      data: response.data,
      originalResponse: response,
    }
  }

  // Verify key expiry/validity
  async verifyKey(): Promise<IPaywayAPIResponse> {
    const response = await this.httpClient!.request({
      url: '/api-keys/latest',
    })

    if (response.status === 200 && response?.data.key !== this.config.secretKey) {
      console.error('Payway API key is about to expire. Please log in to your Payway admin and generate a new api key.')
    }

    return {
      status: response.status,
      statusText: response.statusText,
      data: response.data,
      originalResponse: response,
    }
  }

  async getCCtoken(creditCard: CreditCardDTO): Promise<IPaywayAPIResponse> {
    return this._process({
      method: 'post',
      url: '/single-use-tokens',
      data: qs.stringify({ ...creditCard }),
      headers: {
        Authorization: this.publicAuthHeader,
      },
    })
  }

  async getBankAccountToken(bankAccount: BankAccountDTO): Promise<IPaywayAPIResponse> {
    return this._process({
      method: 'post',
      url: '/single-use-tokens',
      data: qs.stringify({ ...bankAccount }),
      headers: {
        Authorization: this.publicAuthHeader,
      },
    })
  }

  async addCustomer(customer: CustomerDTO): Promise<IPaywayAPIResponse> {
    const payload: any = { ...customer }

    delete payload.customerNumber

    return this._process({
      method: 'put',
      url: `/customers/${customer.customerNumber}`,
      data: qs.stringify({ ...payload }),
    })
  }

  async updateCustomerDetails(
    reference: string,
    customerAddress: AddressDTO,
  ): Promise<IPaywayAPIResponse> {
    return this._process({
      method: 'put',
      url: `/customers/${reference}/contact`,
      data: qs.stringify({ ...customerAddress }),
    })
  }

  async updateCustomerPayment(
    reference: string,
    customerPaymentDetails: PaymentDetailsDTO,
  ): Promise<IPaywayAPIResponse> {
    return this._process({
      method: 'put',
      url: `/customers/${reference}/payment-setup`,
      data: qs.stringify({ ...customerPaymentDetails }),
    })
  }

  async stopCustomerPayments(customerId: string): Promise<IPaywayAPIResponse> {
    return this._process({
      method: 'patch',
      url: `/customers/${customerId}/payment-setup`,
      data: qs.stringify({ stopped: true }),
    })
  }

  async deleteCustomer(customerId: string): Promise<IPaywayAPIResponse> {
    await this.stopCustomerPayments(customerId)

    const response = await this.httpClient!.request({
      method: 'delete',
      url: `/customers/${customerId}`,
    })

    return {
      status: response.status,
      statusText: response.statusText,
      data: response.data,
      originalResponse: response,
    }
  }

  async placeCharge(singleUseTokenId: string, charge: ChargeDTO): Promise<IPaywayAPIResponse> {
    return this._process({
      method: 'post',
      url: '/transactions',
      data: qs.stringify({ singleUseTokenId, ...charge }),
    })
  }

  async placeDirectCharge(charge: ChargeDTO): Promise<IPaywayAPIResponse> {
    return this._process({
      method: 'post',
      url: '/transactions',
      data: qs.stringify({ ...charge }),
    })
  }

  async schedulePayment(customerId: string, schedule: PaymentScheduleDTO): Promise<IPaywayAPIResponse> {
    return this._process({
      method: 'put',
      url: `/customers/${customerId}/schedule`,
      data: qs.stringify({ ...schedule }),
    })
  }
}
