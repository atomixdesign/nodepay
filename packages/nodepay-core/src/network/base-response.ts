export type Json =
| string
| number
| boolean
| null
| { [key: string]: Json }
| Json[]

export interface IBaseResponse {
  status: number
  statusText: string
  internalErrorCode?: number
  data: any
}
