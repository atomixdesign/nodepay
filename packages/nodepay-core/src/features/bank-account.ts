import { IBankAccount } from '../types'

export interface BankAccount {
  createBankAccount(
    bankAccount: IBankAccount
  ): Promise<unknown>
}
