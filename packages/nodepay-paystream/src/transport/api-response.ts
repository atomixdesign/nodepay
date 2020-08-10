import { IBaseResponse } from '@atomixdesign/nodepay-core/build/network'

export interface IPaystreamAPIResponse extends IBaseResponse {
  originalResponse: any
}
