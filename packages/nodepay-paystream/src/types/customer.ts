import { ICustomerDetails } from '@atomixdesign/nodepay-core/src/types';

export class PaystreamAddress {
  constructor(
    public readonly address: string,
    public readonly city: string,
    public readonly state: string,
    public readonly postcode: string,
    public readonly country: string,
  ) {}
}

export class PaystreamCustomer implements ICustomerDetails{
  constructor(
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly reference: string,
    public readonly emailAddress: string,
    public readonly ipAddress: string,
  ) {}
}
