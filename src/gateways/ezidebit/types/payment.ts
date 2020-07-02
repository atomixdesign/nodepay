import { PaymentFrequency, DayOfWeek } from './payment-frequency'

export interface IBasePayment {
  PaymentAmountInCents: number
  PaymentReference: string
}

export interface ICustomerName {
  CustomerName?: string
}

export interface IPaymentSchedule {
  ScheduleStartDate: string
  SchedulePeriodType: PaymentFrequency
  DayOfMonth: number
  PaymentAmountInCents: number
  LimitToNumberOfPayments: number
  LimitToTotalAmountInCents: number
  KeepManualPayments: string
  EziDebitCustomerID?: string
  YourSystemReference?: string
  DayOfWeek?: DayOfWeek
  FirstWeekOfMonth?: string
  SecondWeekOfMonth?: string
  ThirdWeekOfMonth?: string
  FourthWeekOfMonth?: string
  Username?: string
}


