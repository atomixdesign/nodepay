import { IBaseCharge } from '@atomixdesign/nodepay-core/types'
import { IEzidebitInternalCreditCard } from './credit-card'
import { IEzidebitBasePayment, IEzidebitCustomerName } from './payment'

export interface IEzidebitCreditCardCharge extends
  IEzidebitInternalCreditCard,
  IEzidebitBasePayment,
  IEzidebitCustomerName {}

export interface IEzidebitCharge extends IBaseCharge {
  customerName?: string
}
