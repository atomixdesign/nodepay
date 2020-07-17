import { Service } from 'typedi'
import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosError,
  AxiosResponse,
} from 'axios'
import { NetworkClientFactory } from './types/network-client-factory'

@Service('http.client')
export class HttpClientFactory extends NetworkClientFactory<AxiosInstance> {
  create(config?: Partial<AxiosRequestConfig>, debug = false): AxiosInstance{
    const httpClient = axios.create(config)

    httpClient.interceptors.request.use(function (config: AxiosRequestConfig) {
      // TODO: Allow custom interceptor callbacks.
      if (debug) {
        // console.log(`${config.baseURL}${config.url}`)
        console.dir(config, { depth: 0 })
      }
      return config
    }, function (error: AxiosError) {
      // Do something with request error
      return Promise.reject(error)
    })

    // Add a response interceptor
    httpClient.interceptors.response.use(function (response: AxiosResponse) {
      // Do something with the response data
      if (debug) {
        // console.log(response.status, response.statusText)
        console.dir(response, { depth: 0 })
      }
      return response
    }, function (error: AxiosError) {
      // Do something with response error
      if (debug) {
        console.table(error?.response?.data.data)
      }
      return Promise.reject(error)
    })
    return httpClient
  }
}
