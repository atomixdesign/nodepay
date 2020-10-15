import { ICustomerDetails } from '@atomixdesign/nodepay-core/src/types'

export class PaystreamAddress {
  constructor(
    public readonly address: string,
    public readonly city: string,
    public readonly state: string,
    public readonly postcode: string,
    public readonly country: string,
  ) {}
}

export interface PaystreamCustomer extends ICustomerDetails {
  firstName: string
  lastName: string
  reference: string
  emailAddress: string
  ipAddress: string
}

export class PaystreamCustomerDetails implements PaystreamCustomer {
  constructor(
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly reference: string,
    public readonly emailAddress: string,
    public readonly ipAddress: string,
    public readonly address1: string,
    public readonly city: string,
    public readonly state: string,
    public readonly postCode: string,
    public readonly country: string,
    public readonly address2?: string,
  ) {}
}
