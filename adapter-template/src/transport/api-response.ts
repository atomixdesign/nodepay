import { Json, IBaseResponse } from '@atomixdesign/nodepay-core/network'

export interface APIResponse extends IBaseResponse {
  status: number
  statusText: string
  data: Json
}
