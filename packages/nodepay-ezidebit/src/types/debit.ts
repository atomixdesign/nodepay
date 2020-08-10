import { IEzidebitNewBankAccount } from './bank-account'
import { IEzidebitBaseAccount } from './customer'
import { IEzidebitBasePayment } from './payment'
import { IEzidebitBaseCreditCard } from './credit-card'
import { IDirectDebit } from '@atomixdesign/nodepay-core/build/types'

/** @internal */
export interface IEzidebitInternalDebit extends IEzidebitBasePayment {
  DebitDate: string
}

export class EzidebitDirectDebit implements IDirectDebit {
  constructor(
    public readonly customerId: string,
    public readonly paymentReference: string,
    public readonly amountInCents: number,
    public readonly ezidebitCustomerId?: string,
    public readonly debitDate?: string,
    public readonly username?: string,
  ) {}
}

/** @internal */
export interface IEzidebitBaseDebit extends IEzidebitBaseAccount, IEzidebitInternalDebit {}

/** @internal */
export interface IEzidebitCreditCardDebit extends IEzidebitBaseDebit, IEzidebitBaseCreditCard {}

/** @internal */
export interface IEzidebitBankAccountDebit extends IEzidebitBaseDebit, IEzidebitNewBankAccount {
  Username: string
}

/** @internal */
export interface IEzidebitDirectDebitPayment extends IEzidebitInternalDebit {
  EziDebitCustomerID: string
  YourSystemReference: string
  Username: string
}
