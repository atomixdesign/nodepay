import { ICustomerDetails } from '@atomixdesign/nodepay-core/build/types'
import { BPOINTCreditCard } from './credit-card'
import { BPOINTBankAccount } from './bank-account'

/** @internal */
export interface IBPOINTInternalAddress {
  AddressLine1?: string
  AddressLine2?: string
  AddressLine3?: string
  City?: string
  CountryCode?: string
  PostCode?: string
  State?: string
}

/** @internal */
export interface IBPOINTInternalContactDetails {
  EmailAddress?: string
  FaxNumber?: string
  HomePhoneNumber?: string
  MobilePhoneNumber?: string
  WorkPhoneNumber?: string
}

/** @internal */
export interface IBPOINTInternalPersonalDetails {
  DateOfBirth?: string
  FirstName?: string
  LastName?: string
  MiddleName?: string
  Salutation?: string
}

/** @internal */
export interface IBPOINTInternalCustomer extends
  IBPOINTInternalAddress,
  IBPOINTInternalContactDetails,
  IBPOINTInternalPersonalDetails
{
  CardDetails?: BPOINTCreditCard
  BankAccountDetails?: BPOINTBankAccount
  Crn1: string
  EmailAddress: string
}

export class BPOINTCustomer implements ICustomerDetails {
  constructor(
    public readonly emailAddress: string,
    public readonly firstName?: string,
    public readonly lastName?: string,
    public readonly phoneNumber?: string,
    public readonly address1?: string,
    public readonly address2?: string,
    public readonly postCode?: string,
    public readonly region?: string,
    public readonly country?: string,
  ) {}
}
