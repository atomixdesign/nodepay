import { IBaseResponse } from '@atomixdesign/nodepay-core/network'

export interface IPaywayAPIResponse extends IBaseResponse {
  data: any
  originalResponse: any
}
