// handles configurable retry
import { Service, Inject, Container } from 'typedi'
import { AxiosInstance } from 'axios'
// import { v4 as uuidv4 } from 'uuid'
// import qs from 'qs'
import { Config } from '../types'
import {
  HttpClientFactory,
} from '@atomixdesign/nodepay/network'
import { ChargeDTO } from './dtos'
import { APIResponse } from './api-response'
import { BPOINTAPIError } from './api-error'

@Service('bpoint.api')
export class API {
  private httpClient: AxiosInstance

  constructor(
    @Inject('http.client') httpClientFactory: HttpClientFactory
  ) {
    const config: Config = Container.get('bpoint.config')
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
    const response = await this.httpClient!.request({
      method: 'post',
      url: '/txns/',
      data: { 'TxnReq': charge },
    })

    if (Number(response?.data.APIResponse.ResponseCode) !== 0) {
      throw new BPOINTAPIError(response.data.APIResponse)
    }
    if (Number(response?.data.TxnResp.ResponseCode) !== 0) {
      throw new BPOINTAPIError(response.data.TxnResp)
    }

    return response
  }
}
