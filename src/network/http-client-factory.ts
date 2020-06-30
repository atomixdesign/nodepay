import { Service } from 'typedi'
import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosError,
  AxiosResponse,
} from 'axios'
import { INetworkFactory } from './network-client-factory'

const DEBUG = process.env.environment !== 'production'

@Service('http.client')
export class HttpClientFactory implements INetworkFactory<AxiosInstance> {
  create(config?: Partial<AxiosRequestConfig>): AxiosInstance{
    const httpClient = axios.create(config)

    httpClient.interceptors.request.use(function (config: AxiosRequestConfig) {
      // TODO: allow custom interceptor callbacks
      if (DEBUG) {
        // console.log(`${config.baseURL}${config.url}`)
      }
      return config
    }, function (error: AxiosError) {
      // Do something with request error
      return Promise.reject(error)
    })

    // Add a response interceptor
    httpClient.interceptors.response.use(function (response: AxiosResponse) {
      // Do something with the response data
      if (DEBUG) {
        // console.log(response.status, response.statusText)
      }
      return response
    }, function (error: AxiosError) {
      // Do something with response error
      if (DEBUG) {
        console.table(error?.response?.data.data) // , { depth: undefined })
      }
      return Promise.reject(error)
    })
    return httpClient
  }
}
