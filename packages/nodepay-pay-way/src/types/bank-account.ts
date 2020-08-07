import { IBankAccount } from '@atomixdesign/nodepay-core/types'

export class PaywayBankAccount implements IBankAccount {
  constructor(
    public readonly accountName:  string,
    public readonly accountNumber: string,
    public readonly BSBNumber: string,
  ) {}
}