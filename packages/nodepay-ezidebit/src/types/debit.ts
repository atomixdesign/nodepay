import { IBankAccount } from './bank-account'
import { IBaseAccount } from './customer'
import { IBasePayment } from './payment'
import { IBaseCreditCard } from './credit-card'

export interface IDebit extends IBasePayment {
  DebitDate: string
}

export interface IBaseDebit extends IBaseAccount, IDebit {}

export interface ICreditCardDebit extends IBaseDebit, IBaseCreditCard {}

export interface IBankAccountDebit extends IBaseDebit, IBankAccount {}

export interface IDirectDebitPayment extends IDebit {
  EziDebitCustomerID: string
  YourSystemReference: string
  Username: string
}
