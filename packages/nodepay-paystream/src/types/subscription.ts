import { PaystreamPaymentFrequency } from './payment-frequency'

export interface IPaystreamSubscription {
  customer: string
  plan: string
  frequency: PaystreamPaymentFrequency
  startDate: string
  reference: string
  isActive: boolean
}
