import { Json, IBaseResponse } from '@atomixdesign/nodepay-core/network'

export interface IBPOINTAPIResponse extends IBaseResponse {
  status: number
  statusText: string
  data: Json
  originalResponse: any
}
