import { CreditCardDTO, BankAccountDTO } from '../transport/dtos'
import { ICustomerDetails } from '@atomixdesign/nodepay-core/types'

/** @internal */
export interface IBPOINTInternalCustomer {
  CardDetails: CreditCardDTO
  BankAccountDetails?: BankAccountDTO
  Crn1: string
  EmailAddress: string
}

export class BPOINTCustomer implements ICustomerDetails {
  firstName?: string
  lastName?: string
  phoneNumber?: string
  emailAddress: string
  address1?: string
  address2?: string
  postCode?: string
  region?: string
  country?: string

  constructor(
    emailAddress: string,
    firstName?: string,
    lastName?: string,
    phoneNumber?: string,
    address1?: string,
    address2?: string,
    postCode?: string,
    region?: string,
    country?: string,
  ) {
    this.firstName = firstName
    this.lastName = lastName
    this.phoneNumber = phoneNumber
    this.emailAddress = emailAddress
    this.address1 = address1
    this.address2 = address2
    this.postCode = postCode
    this.region = region
    this.country = country
  }
}
