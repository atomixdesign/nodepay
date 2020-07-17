import { IEzidebitCreditCard } from './credit-card'
import { IEzidebitBasePayment, IEzidebitCustomerName } from './payment'

export interface IEzidebitCreditCardCharge extends IEzidebitCreditCard, IEzidebitBasePayment, IEzidebitCustomerName {}
