import { IEzidebitBankAccount } from './bank-account'
import { IEzidebitBaseAccount } from './customer'
import { IEzidebitBasePayment } from './payment'
import { IEzidebitBaseCreditCard } from './credit-card'
import { IDirectDebit } from '@atomixdesign/nodepay-core/src/types'

export interface IEzidebitInternalDebit extends IEzidebitBasePayment {
  DebitDate: string
}

export interface IEzidebitDirectDebit extends IDirectDebit {
  ezidebitCustomerNumber?: string
  debitDate?: string
  username?: string
}

export interface IEzidebitBaseDebit extends IEzidebitBaseAccount, IEzidebitInternalDebit {}

export interface IEzidebitCreditCardDebit extends IEzidebitBaseDebit, IEzidebitBaseCreditCard {}

export interface IEzidebitBankAccountDebit extends IEzidebitBaseDebit, IEzidebitBankAccount {}

export interface IEzidebitDirectDebitPayment extends IEzidebitInternalDebit {
  EziDebitCustomerID: string
  YourSystemReference: string
  Username: string
}
