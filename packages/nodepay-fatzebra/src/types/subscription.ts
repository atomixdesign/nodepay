import { FatzebraPaymentFrequency } from './payment-frequency'

export class FatzebraSubscription {
  constructor(
    public readonly customerId: string,
    public readonly plan: string,
    public readonly frequency: FatzebraPaymentFrequency,
    public readonly startDate: string,
    public readonly reference: string,
    public readonly isActive: boolean,
  ) {}
}
