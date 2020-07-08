/** @internal */
export type Json =
| string
| number
| boolean
| null
| { [key: string]: Json }
| Json[]

/** @internal */
export interface IBaseResponse {
  status: number
  statusText: string
  internalErrorCode?: number
  data?: Json | Record<string, unknown>
}
