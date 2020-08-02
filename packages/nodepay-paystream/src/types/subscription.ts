import { PaystreamPaymentFrequency } from './payment-frequency'

export class PaystreamSubscription {
  constructor(
    public readonly customer: string,
    public readonly plan: string,
    public readonly frequency: PaystreamPaymentFrequency,
    public readonly startDate: string,
    public readonly reference: string,
    public readonly isActive: boolean,
  ) {}
}
