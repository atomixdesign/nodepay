import { IBaseCharge } from '@atomixdesign/nodepay-core/types'

export class PaystreamCharge implements IBaseCharge {
  constructor(
    public readonly orderNumber: string,
    public readonly amountInCents: number,
    public readonly customerIp: string,
    public readonly cardToken?: string,
  ) {}
}
