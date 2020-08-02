import {
  ICustomerDetails,
  ICreditCard,
} from '../types'

export interface CustomerDetails {
  addCustomer(
    customerDetails: ICustomerDetails,
    creditCard?: ICreditCard,
  ): Promise<unknown>
  updateCustomer(
    reference: string,
    customerDetails: ICustomerDetails,
    creditCard?: ICreditCard,
  ): Promise<unknown>
}
