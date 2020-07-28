import { IBaseResponse } from '@atomixdesign/nodepay-core/network'

export interface IPaywayAPIResponse extends IBaseResponse {
  status: number
  statusText: string
  data: any
  originalResponse: any
}
