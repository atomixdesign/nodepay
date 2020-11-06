export class PaystreamPaymentPlan {
  constructor(
    public readonly name: string,
    public readonly amount: number,
    public readonly reference: string,
    public readonly description: string,
  ) {}
}
