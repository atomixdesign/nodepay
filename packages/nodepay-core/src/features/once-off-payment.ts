import { IBaseCharge } from '../types'

export interface OnceOffPayment {
  charge(
    onceOffCharge: IBaseCharge
  ): Promise<unknown>
}
