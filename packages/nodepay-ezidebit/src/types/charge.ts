import { IBaseCharge } from '@atomixdesign/nodepay-core/build/types'
import { IEzidebitInternalCreditCard } from './credit-card'
import { IEzidebitBasePayment, IEzidebitCustomerName } from './payment'

/** @internal */
export interface IEzidebitCreditCardCharge extends
  IEzidebitInternalCreditCard,
  IEzidebitBasePayment,
  IEzidebitCustomerName {}

export class EzidebitCharge implements IBaseCharge {
  constructor(
    public readonly orderNumber: string,
    public readonly amountInCents: number,
    public readonly customerName?: string,
  ) {}
}
