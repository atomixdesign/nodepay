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

export const formatResponse = function(payload: IEzidebitResponse): APIResponse{
  const dataHash = typeof payload.Data === 'string' ? payload.Data : payload.Data.toString()

  return {
    status: payload.ErrorMessage !== undefined ? payload.Error : 200,
    statusText: payload.ErrorMessage !== undefined ? payload.ErrorMessage : dataHash,
    internalErrorCode: payload.Error,
    data: payload.Data,
  }
}
