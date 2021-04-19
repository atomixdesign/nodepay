import { ICustomerDetails } from '@atomixdesign/nodepay-core/build/types'

export class PaywayAddress implements ICustomerDetails {
  constructor(
    public readonly firstName?: string,
    public readonly lastName?: string,
    public readonly phoneNumber?: string,
    public readonly emailAddress?: string,
    public readonly address1?: string,
    public readonly address2?: string,
    public readonly postCode?: string,
    public readonly region?: string,
    public readonly country?: string,
    public city?: string,
    public sendEmailReceipts?: boolean,
  ) {}
}

/** @internal */
export interface IPaywayInternalCustomerPaymentDetails {
  singleUseTokenId: string
  merchantId?: string
  bankAccountId?: string
}

export class PaywayCustomer implements
  PaywayAddress, IPaywayInternalCustomerPaymentDetails {
  constructor(
    public readonly customerId: string,
    public readonly singleUseTokenId: string,
    public readonly merchantId?: string,
    public readonly bankAccountId?: string,
    public readonly firstName?: string,
    public readonly lastName?: string,
    public readonly phoneNumber?: string,
    public readonly emailAddress?: string,
    public readonly address1?: string,
    public readonly address2?: string,
    public readonly postCode?: string,
    public readonly region?: string,
    public readonly country?: string,
    public readonly city?: string,
    public readonly sendEmailReceipts?: boolean,
  ){}
}
