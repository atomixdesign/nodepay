import { IBaseResponse } from '@atomixdesign/nodepay-core/network'

export interface IPaystreamPayload {
  response: Record<string, unknown>
  successful: string
}

export interface IPaystreamAPIResponse extends IBaseResponse {
  data: IPaystreamPayload
  originalResponse: any
}
