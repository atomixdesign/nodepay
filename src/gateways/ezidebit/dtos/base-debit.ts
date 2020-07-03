import { IBaseDebit } from '../types'
import {
  IsNotEmpty,
  IsEmail,
  IsMobilePhone,
  IsNumber,
  IsIn,
  Min,
  MaxLength,
} from 'class-validator'

import {
  ErrorType,
  Errors,
} from '@atomixdesign/nodepay/validation/errors'

export class BaseDebitDTO {
  constructor(baseDebit: IBaseDebit) {
    this.YourSystemReference = baseDebit.YourSystemReference
    this.LastName = baseDebit.LastName
    this.PaymentReference = baseDebit.PaymentReference
    this.PaymentAmountInCents = baseDebit.PaymentAmountInCents
    this.DebitDate = baseDebit.DebitDate
    this.SmsPaymentReminder = baseDebit.SmsPaymentReminder
    this.SmsFailedNotification = baseDebit.SmsFailedNotification
    this.SmsExpiredCard = baseDebit.SmsExpiredCard
    this.Username = baseDebit.Username
    this.YourGeneralReference = baseDebit.YourGeneralReference
    this.FirstName = baseDebit.FirstName
    this.EmailAddress = baseDebit.EmailAddress
    this.MobilePhoneNumber = baseDebit.MobilePhoneNumber
  }

  // * YourSystemReference
  @IsNotEmpty({
    message: Errors.getErrorMessage(ErrorType.NotEmpty, 'YourSystemReference')
  })
  @MaxLength(50, {
    message: Errors.getErrorMessage(ErrorType.FieldTooLong, 'YourSystemReference')
  })
  YourSystemReference: string;

  // * LastName
  @IsNotEmpty({
    message: Errors.getErrorMessage(ErrorType.NotEmpty, 'LastName')
  })
  @MaxLength(60, {
    message: Errors.getErrorMessage(ErrorType.FieldTooLong, 'LastName')
  })
  LastName: string;

  // * PaymentReference
  @MaxLength(50, {
    message: Errors.getErrorMessage(ErrorType.FieldTooLong, 'PaymentReference')
  })
  PaymentReference: string;

  // * PaymentAmountInCents
  @Min(200, {
    message: Errors.getErrorMessage(ErrorType.ValueTooLow, 'PaymentAmountInCents')
  })
  @IsNumber(undefined, {
    message: Errors.getErrorMessage(ErrorType.NotANumber, 'PaymentAmountInCents')
  })
  PaymentAmountInCents: number;

  // * DebitDate
  @IsNotEmpty({
    message: Errors.getErrorMessage(ErrorType.NotEmpty, 'DebitDate')
  })
  DebitDate: string;

  // * SmsPaymentReminder
  @IsNotEmpty({
    message: Errors.getErrorMessage(ErrorType.NotEmpty, 'SmsPaymentReminder')
  })
  @IsIn(['YES', 'NO'], {
    message: Errors.getErrorMessage(ErrorType.NotInAllowedSet, 'SmsPaymentReminder')
  })
  SmsPaymentReminder: string;

  // * SmsFailedNotification
  @IsNotEmpty({
    message: Errors.getErrorMessage(ErrorType.NotEmpty, 'SmsFailedNotification')
  })
  @IsIn(['YES', 'NO'], {
    message: Errors.getErrorMessage(ErrorType.NotInAllowedSet, 'SmsFailedNotification')
  })
  SmsFailedNotification: string;

  // * SmsExpiredCard
  @IsNotEmpty({
    message: Errors.getErrorMessage(ErrorType.NotEmpty, 'SmsExpiredCard')
  })
  @IsIn(['YES', 'NO'], {
    message: Errors.getErrorMessage(ErrorType.NotInAllowedSet, 'SmsExpiredCard')
  })
  SmsExpiredCard: string;

  // * Username
  Username = '';

  // * YourGeneralReference
  @MaxLength(50, {
    message: Errors.getErrorMessage(ErrorType.FieldTooLong, 'YourGeneralReference')
  })
  YourGeneralReference = '';

  // * FirstName
  @MaxLength(30, {
    message: Errors.getErrorMessage(ErrorType.FieldTooLong, 'FirstName')
  })
  FirstName = '';

  // * EmailAddress
  @MaxLength(255, {
    message: Errors.getErrorMessage(ErrorType.FieldTooLong, 'EmailAddress')
  })
  @IsEmail(undefined, {
    message: Errors.getErrorMessage(ErrorType.NotAnEmail, 'EmailAddress')
  })
  EmailAddress = '';

  // * MobilePhoneNumber
  @MaxLength(10, {
    message: Errors.getErrorMessage(ErrorType.FieldTooLong, 'MobilePhoneNumber')
  })
  @IsMobilePhone('en-AU', undefined, {
    message: Errors.getErrorMessage(ErrorType.NotAMobilePhone, 'MobilePhoneNumber')
  })
  MobilePhoneNumber = '';
}
