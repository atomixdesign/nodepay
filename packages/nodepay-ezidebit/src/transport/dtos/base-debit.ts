import {
  IsOptional,
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
  ErrorFactory,
} from '@atomixdesign/nodepay-core/build/validation'
import { IEzidebitBaseDebit } from '../../types'

import debug from 'debug'

const log = debug('nodepay:ezidebit')

/** @internal */
export class BaseDebitDTO {
  constructor(baseDebit: IEzidebitBaseDebit) {
    log(`building ${this.constructor.name}`)
    log({ baseDebit })
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
    message: ErrorFactory.getErrorMessage(ErrorType.NotEmpty, 'YourSystemReference'),
  })
  @MaxLength(50, {
    message: ErrorFactory.getErrorMessage(ErrorType.FieldTooLong, 'YourSystemReference'),
  })
  YourSystemReference: string;

  // * LastName
  @IsNotEmpty({
    message: ErrorFactory.getErrorMessage(ErrorType.NotEmpty, 'LastName'),
  })
  @MaxLength(60, {
    message: ErrorFactory.getErrorMessage(ErrorType.FieldTooLong, 'LastName'),
  })
  LastName: string;

  // * PaymentReference
  @MaxLength(50, {
    message: ErrorFactory.getErrorMessage(ErrorType.FieldTooLong, 'PaymentReference'),
  })
  PaymentReference: string;

  // * PaymentAmountInCents
  @Min(200, {
    message: ErrorFactory.getErrorMessage(ErrorType.ValueTooLow, 'PaymentAmountInCents'),
  })
  @IsNumber(undefined, {
    message: ErrorFactory.getErrorMessage(ErrorType.NotANumber, 'PaymentAmountInCents'),
  })
  PaymentAmountInCents: number;

  // * DebitDate
  @IsNotEmpty({
    message: ErrorFactory.getErrorMessage(ErrorType.NotEmpty, 'DebitDate'),
  })
  DebitDate: string;

  // * SmsPaymentReminder
  @IsNotEmpty({
    message: ErrorFactory.getErrorMessage(ErrorType.NotEmpty, 'SmsPaymentReminder'),
  })
  @IsIn(['YES', 'NO'], {
    message: ErrorFactory.getErrorMessage(ErrorType.NotInAllowedSet, 'SmsPaymentReminder'),
  })
  SmsPaymentReminder: string;

  // * SmsFailedNotification
  @IsNotEmpty({
    message: ErrorFactory.getErrorMessage(ErrorType.NotEmpty, 'SmsFailedNotification'),
  })
  @IsIn(['YES', 'NO'], {
    message: ErrorFactory.getErrorMessage(ErrorType.NotInAllowedSet, 'SmsFailedNotification'),
  })
  SmsFailedNotification: string;

  // * SmsExpiredCard
  @IsNotEmpty({
    message: ErrorFactory.getErrorMessage(ErrorType.NotEmpty, 'SmsExpiredCard'),
  })
  @IsIn(['YES', 'NO'], {
    message: ErrorFactory.getErrorMessage(ErrorType.NotInAllowedSet, 'SmsExpiredCard'),
  })
  SmsExpiredCard: string;

  // * Username
  @IsOptional()
  Username: string | undefined;

  // * YourGeneralReference
  @IsOptional()
  @MaxLength(50, {
    message: ErrorFactory.getErrorMessage(ErrorType.FieldTooLong, 'YourGeneralReference'),
  })
  YourGeneralReference: string | undefined;

  // * FirstName
  @IsOptional()
  @MaxLength(30, {
    message: ErrorFactory.getErrorMessage(ErrorType.FieldTooLong, 'FirstName'),
  })
  FirstName: string | undefined;

  // * EmailAddress
  @IsOptional()
  @MaxLength(255, {
    message: ErrorFactory.getErrorMessage(ErrorType.FieldTooLong, 'EmailAddress'),
  })
  @IsEmail(undefined, {
    message: ErrorFactory.getErrorMessage(ErrorType.NotAnEmail, 'EmailAddress'),
  })
  EmailAddress: string | undefined;

  // * MobilePhoneNumber
  @IsOptional()
  @MaxLength(10, {
    message: ErrorFactory.getErrorMessage(ErrorType.FieldTooLong, 'MobilePhoneNumber'),
  })
  @IsMobilePhone('en-AU', undefined, {
    message: ErrorFactory.getErrorMessage(ErrorType.NotAMobilePhone, 'MobilePhoneNumber'),
  })
  MobilePhoneNumber: string | undefined;
}
