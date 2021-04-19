import { IBaseCharge } from '@atomixdesign/nodepay-core/types'

/** @internal */
export interface IPaywayInternalCharge {
  customerId: string
  orderNumber?: string
  principalAmount: number
  customerIpAddress?: string
  merchantId?: string
  bankAccountId?: string
}

export class PaywayCharge implements IBaseCharge {
  constructor(
    public readonly orderNumber: string,
    public readonly amountInCents: number,
    public readonly customerId?: string,
    public readonly customerIpAddress?: string,
    public readonly merchantId?: string,
    public readonly singleUseTokenId?: string,
  ) {}
}
