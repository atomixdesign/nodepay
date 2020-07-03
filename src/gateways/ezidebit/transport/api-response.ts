import { IBaseResponse } from '@atomixdesign/nodepay/network'

export interface IEzidebitResponse {
  Data: Record<string, unknown>
  Error: number
  ErrorMessage: string
}

export interface APIResponse extends IBaseResponse{
  data: Record<string, unknown>
  statusText: string
}
