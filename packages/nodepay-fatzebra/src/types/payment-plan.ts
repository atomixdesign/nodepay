import { FatzebraPaymentFrequency } from './payment-frequency'

export class FatzebraPaymentPlan {
  constructor(
    public readonly customerId: string,
    public readonly amountInCents: number,
    public readonly frequency: FatzebraPaymentFrequency,
    public readonly startDate: string, // "2025-07-16"
    public paymentMethod?: string,
    public readonly anniversary?: number,
    public readonly setupFee?: number,
    public readonly endDate?: string,
    public readonly reference?: string,
    public readonly description?: string,
    public readonly currency?: string,
    public readonly totalCount?: number,
    public readonly totalAmount?: number,
    public readonly failedPaymentFee?: number,
    public readonly retryInterval?: number,
  ) {}
}
