import { EzidebitDayOfWeek, EzidebitPaymentFrequency } from './payment-frequency'
import { IPaymentSchedule } from '@atomixdesign/nodepay-core/types'

/** @internal */
export interface IEzidebitInternalPaymentSchedule {
  ScheduleStartDate: string
  SchedulePeriodType: EzidebitPaymentFrequency
  DayOfMonth: number
  PaymentAmountInCents: number
  LimitToNumberOfPayments: number
  LimitToTotalAmountInCents: number
  KeepManualPayments: string
  EziDebitCustomerID: string
  YourSystemReference: string
  DayOfWeek: EzidebitDayOfWeek
  FirstWeekOfMonth: string
  SecondWeekOfMonth: string
  ThirdWeekOfMonth: string
  FourthWeekOfMonth: string
  Username: string
}

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
