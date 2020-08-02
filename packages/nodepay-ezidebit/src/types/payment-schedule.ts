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

export class EzidebitPaymentSchedule implements IPaymentSchedule {
  constructor(
    public readonly customerId: string,
    public readonly startDate: string,
    public readonly frequency: EzidebitPaymentFrequency,
    public readonly amountInCents: number,
    public readonly dayOfWeek: EzidebitDayOfWeek,
    public readonly dayOfMonth: number,
    public readonly maxNumberPayments: number,
    public readonly maxTotalAmount: number,
    public readonly keepManualPayments: 'YES' | 'NO',
    public readonly username?: string,
    public readonly ezidebitCustomerId?: string,
    public readonly firstWeekOfMonth?: 'YES' | 'NO',
    public readonly secondWeekOfMonth?: 'YES' | 'NO',
    public readonly thirdWeekOfMonth?: 'YES' | 'NO',
    public readonly fourthWeekOfMonth?: 'YES' | 'NO',
  ) {

  }
}
