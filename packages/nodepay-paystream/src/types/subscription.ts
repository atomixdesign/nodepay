import { PaystreamPaymentFrequency } from './payment-frequency'

export interface IPaystreamInternalSubscription {
  customer: string
  plan: string
  frequency: PaystreamPaymentFrequency
  startDate: string
  reference: string
  isActive: true
}
