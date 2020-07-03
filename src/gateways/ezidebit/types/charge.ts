import { ICreditCard } from './credit-card'
import { IBasePayment, ICustomerName } from './payment'

export interface ICreditCardCharge extends ICreditCard, IBasePayment, ICustomerName {
  PaymentReference: string
}
