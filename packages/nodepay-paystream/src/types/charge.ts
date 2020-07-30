import { IBaseCharge, ICreditCard } from '@atomixdesign/nodepay-core/types'

export class PaystreamCharge implements IBaseCharge, ICreditCard {
  constructor(
    public orderNumber: string,
    public amountInCents: number,
    public customerIp: string,
    public cardNumber?: string,
    public expiryDateMonth?: string,
    public expiryDateYear?: string,
    public CCV?: string,
    public cardHolderName?: string,
    public cardToken?: string,
  ) {}
}
