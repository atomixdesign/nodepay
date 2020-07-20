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
}
