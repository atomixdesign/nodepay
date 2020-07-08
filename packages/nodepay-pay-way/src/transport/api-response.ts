import { Json, IBaseResponse } from '@atomixdesign/nodepay/network'

export interface APIResponse extends IBaseResponse {
  status: number
  statusText: string
  data: Json
}
