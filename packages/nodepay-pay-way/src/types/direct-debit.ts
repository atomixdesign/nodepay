import { IDirectDebit } from '@atomixdesign/nodepay-core/types'

export class PaywayDirectDebit implements IDirectDebit {
  constructor(
    public readonly customerId: string,
    public readonly paymentReference: string,
    public readonly amountInCents: number,
    public readonly customerIpAddress?: string,
  ) {}
}
