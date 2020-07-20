import { IBaseCharge, ICreditCard } from '@atomixdesign/nodepay-core/types'
import { IEzidebitCreditCard } from './credit-card'
import { IEzidebitBasePayment, IEzidebitCustomerName } from './payment'

export interface IEzidebitCreditCardCharge extends IEzidebitCreditCard, IEzidebitBasePayment, IEzidebitCustomerName {}

export interface IEzidebitCharge extends IBaseCharge {
  creditCard: ICreditCard
  customerName?: string
}
