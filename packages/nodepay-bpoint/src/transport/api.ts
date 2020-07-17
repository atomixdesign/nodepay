// handles configurable retry
import { Service, Inject, Container } from 'typedi'
import { AxiosInstance } from 'axios'
import { IConfig } from '../types'
import {
  HttpClientFactory,
} from '@atomixdesign/nodepay-core/network'
import { APIResponse } from './api-response'
import { ChargeDTO, CustomerDTO } from './dtos'
import { BPOINTAPIError } from './api-error'

@Service('bpoint.api')
export class BPOINTAPI {
  private httpClient: AxiosInstance

  constructor(
    @Inject('http.client') httpClientFactory: HttpClientFactory
  ) {
    const config: IConfig = Container.get('bpoint.config')
    const authHeader = this.encodeKey(`${config.username}|${config.merchantId}:${config.password}`)

    this.httpClient = httpClientFactory.create({
      baseURL: config.apiRoot,
      headers: {
        Authorization: authHeader,
        'Content-Type': 'application/json; charset=utf-8',
      }
    }, false)
  }

  private encodeKey(key: string): string {
    return Buffer.from(key, 'binary').toString('base64')
  }

  async placeCharge(/* dvToken?: string,*/ charge: ChargeDTO): Promise<APIResponse> {
    let response
    try {
      response = await this.httpClient!.request({
        method: 'post',
        url: '/txns/',
        data: { 'TxnReq': charge },
      })
    } catch (error) {
      return Promise.reject(error)
    }
    if (Number(response?.data.APIResponse.ResponseCode) !== 0) {
      return Promise.reject(new BPOINTAPIError(response.data.APIResponse))
    }
    if (Number(response?.data.TxnResp.ResponseCode) !== 0) {
      return Promise.reject(new BPOINTAPIError(response.data.TxnResp))
    }

    return response
  }

  async addCustomer(customer: CustomerDTO): Promise<APIResponse> {
    let response
    try {
      response = await this.httpClient!.request({
        method: 'post',
        url: '/dvtokens/',
        data: { 'DVTokenReq': customer },
      })
    } catch (error) {
      return Promise.reject(error)
    }
    if (Number(response?.data.APIResponse.ResponseCode) !== 0) {
      return Promise.reject(new BPOINTAPIError(response.data.APIResponse))
    }

    return response
  }
}
