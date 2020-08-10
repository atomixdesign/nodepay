/** @internal */
export interface IEzidebitNewBankAccount {
  EziDebitCustomerID: string
  YourSystemReference: string
  BankAccountName: string
  BankAccountBSB: string
  BankAccountNumber: string
  Reactivate?: string
  Username: string
}

import { IBankAccount } from '@atomixdesign/nodepay-core/build/types'

export class EzidebitBankAccount implements IBankAccount {
  constructor(
    public readonly accountName: string,
    public readonly accountNumber: string,
    public readonly BSBNumber: string,
  ) {}
}
