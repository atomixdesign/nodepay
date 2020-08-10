import { IPaymentSchedule } from '@atomixdesign/nodepay-core/build/types'
import { PaywayPaymentFrequency } from './payment-frequency'

/** @internal */
export interface IPaywayInternalPaymentSchedule {
  frequency: PaywayPaymentFrequency
  nextPaymentDate: string
  regularPrincipalAmount: number
  nextPrincipalAmount?: number
  numberOfPaymentsRemaining?: number
  finalPrincipalAmount?: number
}

export class PaywayPaymentSchedule implements IPaymentSchedule {
  constructor(
    public readonly customerId: string,
    public readonly startDate: string,
    public readonly amountInCents: number,
    public readonly frequency: PaywayPaymentFrequency,
    public readonly nextPaymentDate?: string,
    public readonly nextPrincipalAmount?: number,
    public readonly numberOfPaymentsRemaining?: number,
    public readonly finalPrincipalAmount?: number,
  ) {}
}
