import { IBaseCharge } from '@atomixdesign/nodepay-core/build/types'

export class FatzebraCharge implements IBaseCharge {
  constructor(
    public readonly orderNumber: string,
    public readonly amountInCents: number,
    public readonly customerIp: string,
    public readonly cardToken?: string,
    public readonly capture = true,
  ) {}
}
