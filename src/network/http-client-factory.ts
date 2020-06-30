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
      // Do something before request is sent
      if (DEBUG) {
        // console.log(`${config.baseURL}${config.url}`)
        // console.dir(config, { depth: undefined })
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
        // console.dir(response, { depth: undefined })
      }
      return response
    }, function (error: AxiosError) {
      // Do something with response error
      if (DEBUG) {
        // console.dir(error, { depth: undefined })
        console.table(error?.response?.data.data) // , { depth: undefined })
      }
      return Promise.reject(error)
    })
    return httpClient
  }
}
