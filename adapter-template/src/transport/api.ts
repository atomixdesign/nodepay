import { Service, Inject, Container } from 'typedi'
import { AxiosInstance } from 'axios'
import { Config } from '../types'
import {
  HttpClientFactory,
} from '@atomixdesign/nodepay-core/build/network'
import { APIResponse } from './api-response'

@Service('sample.api')
export class API {
  private authHeader: string

  private httpClient: AxiosInstance

  constructor(
    @Inject('http.client') httpClientFactory: HttpClientFactory
  ) {
    const config: Config = Container.get('sample.config')
    this.authHeader = `Basic ${config.secretKey}`

    this.httpClient = httpClientFactory.create({
      baseURL: config.apiRoot,
      headers: {
        Authorization: this.authHeader,
      }
    })
  }

  async placeCharge(charge: object): Promise<APIResponse> {
    const response = await this.httpClient!.request({
      method: 'post',
      url: '/transactions',
      data: { ...charge },
    })

    return {
      status: response.status,
      statusText: response.statusText,
      data: response.data,
    }
  }

  async placeDirectCharge(directCharge: object): Promise<APIResponse> {
    const response = await this.httpClient!.request({
      method: 'post',
      url: '/transactions',
      data: { ...directCharge },
    })

    return {
      status: response.status,
      statusText: response.statusText,
      data: response.data,
    }
  }

  async schedulePayment(customerRef: string, schedule: object): Promise<APIResponse> {
    const response = await this.httpClient!.request({
      method: 'put',
      url: `/customers/${customerRef}/schedule`,
      data: { ...schedule },
    })

    return {
      status: response.status,
      statusText: response.statusText,
      data: response.data,
    }
  }
}
