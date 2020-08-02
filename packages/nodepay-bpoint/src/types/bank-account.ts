import { IBankAccount } from '@atomixdesign/nodepay-core/types'

export class BPOINTBankAccount implements IBankAccount {
  constructor(
    public readonly accountName:  string,
    public readonly accountNumber: string,
    public readonly BSBNumber: string,
  ) {}
}
