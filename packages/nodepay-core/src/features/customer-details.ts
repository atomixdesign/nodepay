import { ICustomer, ICreditCard, IBankAccount } from '../types'

export interface CustomerDetails {
  addCustomer(
    customerDetails: ICustomer,
    creditCard?: ICreditCard,
    bankAccount?: IBankAccount,
  ): Promise<unknown>
}
