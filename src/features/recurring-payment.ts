export interface RecurringPayment {
  chargeRecurring(...args: unknown[]): Promise<unknown>
}
