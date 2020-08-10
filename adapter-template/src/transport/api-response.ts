import { Json, IBaseResponse } from '@atomixdesign/nodepay-core/build/network'

export interface APIResponse extends IBaseResponse {
  status: number
  statusText: string
  data: Json
}
