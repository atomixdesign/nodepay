import { CreditCardDTO, BankAccountDTO } from '../transport/dtos'
import { ICustomerDetails } from '@atomixdesign/nodepay-core/types'

/** @internal */
export interface IBPOINTInternalCustomer {
  CardDetails: CreditCardDTO
  BankAccountDetails?: BankAccountDTO
  Crn1: string
  EmailAddress: string
}

export interface IBPOINTCustomer extends ICustomerDetails {
  emailAddress: string
}
