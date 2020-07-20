import { EzidebitDayOfWeek } from './payment-frequency'
import { IPaymentSchedule } from '@atomixdesign/nodepay-core/types'

export interface IEzidebitPaymentSchedule extends IPaymentSchedule {
  ezidebitCustomerId: string
  dayOfWeek: EzidebitDayOfWeek
  dayOfMonth: number
  firstWeekOfMonth?: 'YES' | 'NO'
  secondWeekOfMonth?: 'YES' | 'NO'
  thirdWeekOfMonth?: 'YES' | 'NO'
  fourthWeekOfMonth?: 'YES' | 'NO'
  maxNumberPayments: number
  maxTotalAmount: number
  keepManualPayments: 'YES' | 'NO'
  username?: string
}
