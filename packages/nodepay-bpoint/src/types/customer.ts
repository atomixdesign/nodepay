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
  constructor(
    public emailAddress: string,
    public firstName?: string,
    public lastName?: string,
    public phoneNumber?: string,
    public address1?: string,
    public address2?: string,
    public postCode?: string,
    public region?: string,
    public country?: string,
  ) {}
}
