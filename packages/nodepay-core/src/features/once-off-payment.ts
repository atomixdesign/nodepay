import { ICreditCard } from '../types/credit-card'

export interface OnceOffPayment {
  charge(
    orderNumber: string,
    amountInCents: number,
    creditCard: ICreditCard,
    metadata: Record<string, unknown>
  ): Promise<unknown>
}
