import { EzidebitPaymentFrequency, EzidebitDayOfWeek } from './payment-frequency'

export interface IEzidebitBasePayment {
  PaymentAmountInCents: number
  PaymentReference: string
}

export interface IEzidebitCustomerName {
  CustomerName: string
}

export interface IEzidebitPaymentSchedule {
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


