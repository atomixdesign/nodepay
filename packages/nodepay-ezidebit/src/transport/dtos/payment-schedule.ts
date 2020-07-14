import { IsOptional, IsNumberString, MaxLength, IsNumber, IsNotEmpty, IsIn } from 'class-validator'
import { Errors, ErrorType } from '@atomixdesign/nodepay-core/validation/errors'
import { IPaymentSchedule, PaymentFrequency, DayOfWeek } from '../../types'

export class PaymentScheduleDTO {
  constructor(paymentSchedule: IPaymentSchedule) {
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
    message: Errors.getErrorMessage(ErrorType.NotANumber, 'EziDebitCustomerID')
  })
  @MaxLength(50, {
    message: Errors.getErrorMessage(ErrorType.FieldTooLong, 'EziDebitCustomerID')
  })
  EziDebitCustomerID: string | undefined;

  // * YourSystemReference
  @IsOptional()
  @MaxLength(50, {
    message: Errors.getErrorMessage(ErrorType.FieldTooLong, 'YourSystemReference')
  })
  YourSystemReference: string | undefined;

  // * ScheduleStartDate
  @IsNotEmpty({
    message: Errors.getErrorMessage(ErrorType.NotEmpty, 'ScheduleStartDate')
  })
  @MaxLength(10, {
    message: Errors.getErrorMessage(ErrorType.FieldTooLong, 'ScheduleStartDate')
  })
  ScheduleStartDate: string;

  // * SchedulePeriodType
  @IsNotEmpty({
    message: Errors.getErrorMessage(ErrorType.NotEmpty, 'SchedulePeriodType')
  })
  SchedulePeriodType: PaymentFrequency;

  // * DayOfWeek
  @IsOptional()
  @IsIn(['MON', 'TUE', 'WED', 'THU', 'FRI'], {
    message: Errors.getErrorMessage(ErrorType.NotInAllowedSet, 'DayOfWeek')
  })
  DayOfWeek: DayOfWeek;

  // * DayOfMonth
  @IsOptional()
  @IsNumber(undefined, {
    message: Errors.getErrorMessage(ErrorType.NotANumber, 'DayOfMonth')
  })
  DayOfMonth: number;

  // * FirstWeekOfMonth
  @IsOptional()
  @IsIn(['YES', 'NO', ''], {
    message: Errors.getErrorMessage(ErrorType.NotInAllowedSet, 'FirstWeekOfMonth')
  })
  FirstWeekOfMonth: string;

  // * SecondWeekOfMonth
  @IsOptional()
  @IsIn(['YES', 'NO', ''], {
    message: Errors.getErrorMessage(ErrorType.NotInAllowedSet, 'SecondWeekOfMonth')
  })
  SecondWeekOfMonth: string;

  // * ThirdWeekOfMonth
  @IsOptional()
  @IsIn(['YES', 'NO', ''], {
    message: Errors.getErrorMessage(ErrorType.NotInAllowedSet, 'ThirdWeekOfMonth')
  })
  ThirdWeekOfMonth: string;

  // * FourthWeekOfMonth
  @IsOptional()
  @IsIn(['YES', 'NO', ''], {
    message: Errors.getErrorMessage(ErrorType.NotInAllowedSet, 'FourthWeekOfMonth')
  })
  FourthWeekOfMonth: string;

  // * KeepManualPayments
  @IsIn(['YES', 'NO'], {
    message: Errors.getErrorMessage(ErrorType.NotInAllowedSet, 'KeepManualPayments')
  })
  KeepManualPayments: string;

  // * LimitToNumberOfPayments
  @IsNumber(undefined, {
    message: Errors.getErrorMessage(ErrorType.NotANumber, 'LimitToNumberOfPayments')
  })
  LimitToNumberOfPayments: number;

  // * LimitToTotalAmountInCents
  @IsNumber(undefined, {
    message: Errors.getErrorMessage(ErrorType.NotANumber, 'LimitToTotalAmountInCents')
  })
  LimitToTotalAmountInCents: number;

  // * PaymentAmountInCents
  @IsNumber(undefined, {
    message: Errors.getErrorMessage(ErrorType.NotANumber, 'PaymentAmountInCents')
  })
  PaymentAmountInCents: number;

  // * Username
  @IsOptional()
  @MaxLength(50, {
    message: Errors.getErrorMessage(ErrorType.FieldTooLong, 'Username')
  })
  Username: string | undefined;

}
