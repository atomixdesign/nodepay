import { Json, IBaseResponse } from '@atomixdesign/nodepay-core/network'

export interface IBPOINTAPIResponse extends IBaseResponse {
  data: Json
  originalResponse: any
}
