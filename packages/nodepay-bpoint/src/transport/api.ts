import { Service } from 'typedi'
import { AxiosInstance } from 'axios'
import {
  HttpClientFactory,
  IBaseResponse,
} from '@atomixdesign/nodepay-core/build/network'
import { BPOINTConfig } from '../types'
import { ChargeDTO, CustomerDTO } from './dtos'
import { BPOINTAPIError } from './api-error'

@Service()
export class BPOINTAPI {
  private httpClient: AxiosInstance

  constructor(
    private config: BPOINTConfig,
  ) {
    const httpClientFactory: HttpClientFactory = new HttpClientFactory()
    const authHeader = this.encodeKey(`${config.username}|${config.merchantId}:${config.password}`)

    this.httpClient = httpClientFactory.create({
      baseURL: config.apiRoot,
      headers: {
        Authorization: authHeader,
        'Content-Type': 'application/json; charset=utf-8',
      },
    })
  }

  private encodeKey(key: string): string {
    return Buffer.from(key, 'binary').toString('base64')
  }

  async placeCharge(/* dvToken?: string,*/ charge: ChargeDTO): Promise<IBaseResponse> {
    const response = await this.httpClient!.request({
      method: 'post',
      url: '/txns/',
      data: { 'TxnReq': charge },
    })

    if (Number(response?.data?.APIResponse?.ResponseCode) !== 0) {
      throw new BPOINTAPIError(response.data.APIResponse)
    }

    if (Number(response?.data?.TxnResp?.ResponseCode) !== 0) {
      throw new BPOINTAPIError(response.data.TxnResp)
    }

    return {
      status: response.status,
      statusText: response.statusText,
      data: response.data,
      originalResponse: response,
    }
  }

  async addCustomer(customer: CustomerDTO): Promise<IBaseResponse> {
    const response = await this.httpClient!.request({
      method: 'post',
      url: '/dvtokens/',
      data: { 'DVTokenReq': customer },
    })

    if (Number(response?.data?.APIResponse?.ResponseCode) !== 0) {
      throw new BPOINTAPIError(response.data.APIResponse)
    }

    return {
      status: response.status,
      statusText: response.statusText,
      data: response.data,
      originalResponse: response,
    }
  }

  async updateCustomer(reference: string, customer: CustomerDTO): Promise<IBaseResponse> {
    const response = await this.httpClient!.request({
      method: 'put',
      url: `/dvtokens/${reference}`,
      data: { 'DVTokenReq': customer },
    })

    if (Number(response?.data?.APIResponse?.ResponseCode) !== 0) {
      throw new BPOINTAPIError(response.data.APIResponse)
    }

    return {
      status: response.status,
      statusText: response.statusText,
      data: response.data,
      originalResponse: response,
    }
  }
}
