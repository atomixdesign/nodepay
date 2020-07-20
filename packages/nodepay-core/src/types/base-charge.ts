import { ICreditCard } from './credit-card'

export interface IBaseCharge {
  orderNumber: string
  amountInCents: number
  creditCard?: ICreditCard
}
