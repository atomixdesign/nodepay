import { IBankAccount } from '@atomixdesign/nodepay-core/types'

export class BPOINTBankAccount implements IBankAccount {
  constructor(
    public accountName:  string,
    public accountNumber: string,
    public BSBNumber: string,
  ) {}
}
