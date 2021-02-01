export interface RecurringPayment {
  chargeRecurring(...arguments_: unknown[]): Promise<unknown>
}
