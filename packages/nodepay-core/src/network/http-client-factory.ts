import { Service } from 'typedi'
import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosError,
  AxiosResponse,
} from 'axios'
import { NetworkClientFactory } from './types/network-client-factory'

import debug from 'debug'

const log = debug('nodepay:core')

@Service('http.client')
export class HttpClientFactory extends NetworkClientFactory<AxiosInstance> {
  create(config?: Partial<AxiosRequestConfig>): AxiosInstance{
    const httpClient = axios.create(config)

    httpClient.interceptors.request.use(function (config: AxiosRequestConfig) {
      // TODO: Allow custom interceptor callbacks.

      log({ config })

      return config
    }, function (error: AxiosError) {
      // Do something with request error
      log({ error })

      return Promise.reject(error)
    })

    // Add a response interceptor
    httpClient.interceptors.response.use(function (response: AxiosResponse) {
      return response
    }, function (error: AxiosError) {
      return Promise.reject(error)
    })

    return httpClient
  }
}
