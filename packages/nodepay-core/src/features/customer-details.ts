import {
  ICustomerDetails,
  ICreditCard,
  IBankAccount,
} from '../types'

export interface CustomerDetails {
  addCustomer(
    customerDetails: ICustomerDetails,
    creditCard?: ICreditCard,
    bankAccount?: IBankAccount,
  ): Promise<unknown>
  updateCustomer(
    reference: string,
    customerDetails: ICustomerDetails,
    creditCard?: ICreditCard,
    bankAccount?: IBankAccount,
  ): Promise<unknown>
  // TODO: add overloads/setter methods for creditCard, bankAccount alone.
}
