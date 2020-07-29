import { ICreditCard, IBaseCharge } from '../types'

export interface OnceOffPayment {
  charge(
    onceOffCharge: IBaseCharge,
    creditCard: ICreditCard,
  ): Promise<unknown>
}
