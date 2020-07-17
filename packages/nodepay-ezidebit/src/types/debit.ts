import { IEzidebitBankAccount } from './bank-account'
import { IEzidebitBaseAccount } from './customer'
import { IEzidebitBasePayment } from './payment'
import { IEzidebitBaseCreditCard } from './credit-card'

export interface IEzidebitDebit extends IEzidebitBasePayment {
  DebitDate: string
}

export interface IEzidebitBaseDebit extends IEzidebitBaseAccount, IEzidebitDebit {}

export interface IEzidebitCreditCardDebit extends IEzidebitBaseDebit, IEzidebitBaseCreditCard {}

export interface IEzidebitBankAccountDebit extends IEzidebitBaseDebit, IEzidebitBankAccount {}

export interface IEzidebitDirectDebitPayment extends IEzidebitDebit {
  EziDebitCustomerID: string
  YourSystemReference: string
  Username: string
}
