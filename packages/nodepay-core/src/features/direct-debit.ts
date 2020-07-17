export interface DirectDebit {
  directDebit(
    customerId: string,
    paymentReference: string,
    amountInCents: number,
    metadata: Record<string, any>,
  ): Promise<unknown>
}
