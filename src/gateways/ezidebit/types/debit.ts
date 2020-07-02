import { IBankAccount } from './bank-account'
import { IBaseAccount } from './customer'
import { IBasePayment } from './payment'
import { IBaseCreditCard } from './credit-card'

export interface IDebit extends IBasePayment {
  PaymentAmountInCents: number
  PaymentReference: string
  DebitDate: string
}

export interface IBaseDebit extends IBaseAccount, IDebit {}

export interface ICreditCardDebit extends IBaseDebit, IBaseCreditCard {}

export interface IBankAccountDebit extends IBaseDebit, IBankAccount {}
