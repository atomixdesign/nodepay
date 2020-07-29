import { IBaseResponse } from '@atomixdesign/nodepay-core/network'

export interface IPaystreamAPIResponse extends IBaseResponse {
  originalResponse: any
}
