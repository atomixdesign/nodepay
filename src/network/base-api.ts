import {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosError,
  AxiosResponse,
} from 'axios'

const DEBUG = process.env.environment !== 'production'

export abstract class BaseAPI<T extends Record<string, unknown> = Record<string, unknown>, P = Partial<T>> {
    protected httpClient: AxiosInstance | undefined

    protected registerLogger(): void{
      this.httpClient!.interceptors.request.use(function (config: AxiosRequestConfig) {
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
      this.httpClient!.interceptors.response.use(function (response: AxiosResponse) {
        // Do something with the response data
        if (DEBUG) {
          // console.log(response.status, response.statusText)
        }
        return response
      }, function (error: AxiosError) {
        // Do something with response error
        // console.dir(error, { depth: undefined })
        return Promise.reject(error)
      })
    }
}
