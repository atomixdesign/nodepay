import { IsOptional, IsNumberString, MaxLength, IsNumber, IsNotEmpty, IsIn } from 'class-validator'
import { ErrorFactory, ErrorType } from '@atomixdesign/nodepay-core/validation'
import { IEzidebitInternalPaymentSchedule, EzidebitPaymentFrequency, EzidebitDayOfWeek } from '../../types'

export class PaymentScheduleDTO {
  constructor(paymentSchedule: IEzidebitInternalPaymentSchedule) {
    if (paymentSchedule.YourSystemReference === undefined)
      this.EziDebitCustomerID = paymentSchedule.EziDebitCustomerID
    if (paymentSchedule.EziDebitCustomerID === undefined)
      this.YourSystemReference = paymentSchedule.YourSystemReference
    this.ScheduleStartDate = paymentSchedule.ScheduleStartDate
    this.SchedulePeriodType = paymentSchedule.SchedulePeriodType
    this.DayOfWeek = paymentSchedule.DayOfWeek
    this.DayOfMonth = paymentSchedule.DayOfMonth
    this.FirstWeekOfMonth = paymentSchedule.FirstWeekOfMonth
    this.SecondWeekOfMonth = paymentSchedule.SecondWeekOfMonth
    this.ThirdWeekOfMonth = paymentSchedule.ThirdWeekOfMonth
    this.FourthWeekOfMonth = paymentSchedule.FourthWeekOfMonth
    this.PaymentAmountInCents = paymentSchedule.PaymentAmountInCents
    this.LimitToNumberOfPayments = paymentSchedule.LimitToNumberOfPayments
    this.LimitToTotalAmountInCents = paymentSchedule.LimitToTotalAmountInCents
    this.KeepManualPayments = paymentSchedule.KeepManualPayments
    this.Username = paymentSchedule.Username
  }
  // * EziDebitCustomerID
  @IsOptional()
  @IsNumberString(undefined, {
    message: ErrorFactory.getErrorMessage(ErrorType.NotANumber, 'EziDebitCustomerID')
  })
  @MaxLength(50, {
    message: ErrorFactory.getErrorMessage(ErrorType.FieldTooLong, 'EziDebitCustomerID')
  })
  EziDebitCustomerID: string | undefined;

  // * YourSystemReference
  @IsOptional()
  @MaxLength(50, {
    message: ErrorFactory.getErrorMessage(ErrorType.FieldTooLong, 'YourSystemReference')
  })
  YourSystemReference: string | undefined;

  // * ScheduleStartDate
  @IsNotEmpty({
    message: ErrorFactory.getErrorMessage(ErrorType.NotEmpty, 'ScheduleStartDate')
  })
  @MaxLength(10, {
    message: ErrorFactory.getErrorMessage(ErrorType.FieldTooLong, 'ScheduleStartDate')
  })
  ScheduleStartDate: string;

  // * SchedulePeriodType
  @IsNotEmpty({
    message: ErrorFactory.getErrorMessage(ErrorType.NotEmpty, 'SchedulePeriodType')
  })
  SchedulePeriodType: EzidebitPaymentFrequency;

  // * DayOfWeek
  @IsOptional()
  @IsIn(['MON', 'TUE', 'WED', 'THU', 'FRI'], {
    message: ErrorFactory.getErrorMessage(ErrorType.NotInAllowedSet, 'DayOfWeek')
  })
  DayOfWeek: EzidebitDayOfWeek;

  // * DayOfMonth
  @IsOptional()
  @IsNumber(undefined, {
    message: ErrorFactory.getErrorMessage(ErrorType.NotANumber, 'DayOfMonth')
  })
  DayOfMonth: number;

  // * FirstWeekOfMonth
  @IsOptional()
  @IsIn(['YES', 'NO', ''], {
    message: ErrorFactory.getErrorMessage(ErrorType.NotInAllowedSet, 'FirstWeekOfMonth')
  })
  FirstWeekOfMonth: string;

  // * SecondWeekOfMonth
  @IsOptional()
  @IsIn(['YES', 'NO', ''], {
    message: ErrorFactory.getErrorMessage(ErrorType.NotInAllowedSet, 'SecondWeekOfMonth')
  })
  SecondWeekOfMonth: string;

  // * ThirdWeekOfMonth
  @IsOptional()
  @IsIn(['YES', 'NO', ''], {
    message: ErrorFactory.getErrorMessage(ErrorType.NotInAllowedSet, 'ThirdWeekOfMonth')
  })
  ThirdWeekOfMonth: string;

  // * FourthWeekOfMonth
  @IsOptional()
  @IsIn(['YES', 'NO', ''], {
    message: ErrorFactory.getErrorMessage(ErrorType.NotInAllowedSet, 'FourthWeekOfMonth')
  })
  FourthWeekOfMonth: string;

  // * KeepManualPayments
  @IsIn(['YES', 'NO'], {
    message: ErrorFactory.getErrorMessage(ErrorType.NotInAllowedSet, 'KeepManualPayments')
  })
  KeepManualPayments: string;

  // * LimitToNumberOfPayments
  @IsNumber(undefined, {
    message: ErrorFactory.getErrorMessage(ErrorType.NotANumber, 'LimitToNumberOfPayments')
  })
  LimitToNumberOfPayments: number;

  // * LimitToTotalAmountInCents
  @IsNumber(undefined, {
    message: ErrorFactory.getErrorMessage(ErrorType.NotANumber, 'LimitToTotalAmountInCents')
  })
  LimitToTotalAmountInCents: number;

  // * PaymentAmountInCents
  @IsNumber(undefined, {
    message: ErrorFactory.getErrorMessage(ErrorType.NotANumber, 'PaymentAmountInCents')
  })
  PaymentAmountInCents: number;

  // * Username
  @IsOptional()
  @MaxLength(50, {
    message: ErrorFactory.getErrorMessage(ErrorType.FieldTooLong, 'Username')
  })
  Username: string | undefined;

}
