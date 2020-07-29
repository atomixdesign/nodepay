import { IPaymentSchedule } from '@atomixdesign/nodepay-core/types'
import { PaywayPaymentFrequency } from './payment-frequency'

export interface IPaywayPaymentSchedule extends IPaymentSchedule {
  frequency: PaywayPaymentFrequency
  nextPaymentDate?: string
  nextPrincipalAmount?: number
  numberOfPaymentsRemaining?: number
  finalPrincipalAmount?: number
}
