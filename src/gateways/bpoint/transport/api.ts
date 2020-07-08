// handles configurable retry
import { Service, Inject, Container } from 'typedi'
import { AxiosInstance, AxiosResponse } from 'axios'
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

  async addCustomer(/* customer: CustomerDTO */): Promise<AxiosResponse | undefined> {
    /* const payload = { ...customer }
    delete payload.customerNumber

    const response = await this.httpClient!.request({
      method: 'put',
      url: `/customers/${customer.customerNumber}`,
      data: qs.stringify({ ...payload }),
    })

    return response */
    // eslint-disable-next-line unicorn/no-useless-undefined
    return Promise.resolve(undefined)
  }

  async deleteCustomer(/* customerNumber: string */): Promise<AxiosResponse | undefined> {
    /* await this.stopCustomerPayments(customerNumber)
    const response = await this.httpClient!.request({
      method: 'delete',
      url: `/customers/${customerNumber}`,
    })

    return response */
    // eslint-disable-next-line unicorn/no-useless-undefined
    return Promise.resolve(undefined)
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

  async placeDirectCharge(/* charge: ChargeDTO */): Promise<APIResponse | undefined> {
    /* const response = await this.httpClient!.request({
      method: 'post',
      url: '/transactions',
      data: qs.stringify({ ...charge }),
    })

    return {
      status: response.status,
      statusText: response.statusText,
      data: response.data,
    } */
    // eslint-disable-next-line unicorn/no-useless-undefined
    return Promise.resolve(undefined)
  }

  async schedulePayment(/* customerNumber: string, schedule: PaymentScheduleDTO */): Promise<APIResponse | undefined> {
    /* const response = await this.httpClient!.request({
      method: 'put',
      url: `/customers/${customerNumber}/schedule`,
      data: qs.stringify({ ...schedule }),
    })

    return {
      status: response.status,
      statusText: response.statusText,
      data: response.data,
    } */
    // eslint-disable-next-line unicorn/no-useless-undefined
    return Promise.resolve(undefined)
  }
}
