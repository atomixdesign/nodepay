import { IBankAccount } from '@atomixdesign/nodepay-core/types'

export class BPOINTBankAccount implements IBankAccount {
  accountName:  string
  accountNumber: string
  BSBNumber: string

  constructor(
    accountName:  string,
    accountNumber: string,
    BSBNumber: string,
  ) {
    this.accountName = accountName
    this.accountNumber = accountNumber
    this.BSBNumber = BSBNumber
  }
}
