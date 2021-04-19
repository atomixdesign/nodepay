import {
  IsOptional,
  IsNotEmpty,
  IsNumberString,
  MaxLength,
  IsIn,
  IsEmail,
  IsMobilePhone,
} from 'class-validator'

import {
  ErrorType,
  ErrorFactory,
} from '@atomixdesign/nodepay-core/validation'
import { IEzidebitInternalCustomer } from '../../types'

import debug from 'debug'
import { IsOptionalIfEmpty } from './IsOptionalIfEmpty'
const log = debug('nodepay:ezidebit')

/** @internal */
export class CustomerDTO {
  constructor(customer: IEzidebitInternalCustomer) {
    log(`building ${this.constructor.name}`)
    log({ customer })
    this.YourSystemReference = customer.YourSystemReference
    this.YourGeneralReference = customer.YourGeneralReference
    this.LastName = customer.LastName
    this.FirstName = customer.FirstName

    this.AddressLine1 = customer.AddressLine1
    this.AddressLine2 = customer.AddressLine2
    this.AddressSuburb = customer.AddressSuburb
    this.AddressState = customer.AddressState
    this.AddressPostCode = customer.AddressPostCode
    this.EmailAddress = customer.EmailAddress
    this.MobilePhoneNumber = customer.MobilePhoneNumber

    this.ContractStartDate = customer.ContractStartDate
    this.SmsPaymentReminder = customer.SmsPaymentReminder
    this.SmsFailedNotification = customer.SmsFailedNotification
    this.SmsExpiredCard = customer.SmsExpiredCard

    this.Username = customer.Username
  }

  // * YourSystemReference
  @MaxLength(50, {
    message: ErrorFactory.getErrorMessage(ErrorType.FieldTooLong, 'YourSystemReference')
  })
  YourSystemReference: string;

  // * YourGeneralReference
  @IsOptional()
  @MaxLength(50, {
    message: ErrorFactory.getErrorMessage(ErrorType.FieldTooLong, 'YourGeneralReference')
  })
  YourGeneralReference: string | undefined;

  // * LastName
  @IsNotEmpty({
    message: ErrorFactory.getErrorMessage(ErrorType.NotEmpty, 'LastName')
  })
  @MaxLength(60, {
    message: ErrorFactory.getErrorMessage(ErrorType.FieldTooLong, 'LastName')
  })
  LastName: string;

  // * FirstName
  @IsOptionalIfEmpty()
  @MaxLength(30, {
    message: ErrorFactory.getErrorMessage(ErrorType.FieldTooLong, 'FirstName')
  })
  FirstName: string | undefined;

  // * AddressLine1
  @IsOptionalIfEmpty()
  @MaxLength(30, {
    message: ErrorFactory.getErrorMessage(ErrorType.FieldTooLong, 'AddressLine1')
  })
  AddressLine1: string | undefined;

  // * AddressLine2
  @IsOptionalIfEmpty()
  @MaxLength(30, {
    message: ErrorFactory.getErrorMessage(ErrorType.FieldTooLong, 'AddressLine2')
  })
  AddressLine2: string | undefined;

  // * AddressSuburb
  @IsOptionalIfEmpty()
  @MaxLength(20, {
    message: ErrorFactory.getErrorMessage(ErrorType.FieldTooLong, 'AddressSuburb')
  })
  AddressSuburb: string | undefined;

  // * AddressState
  @IsOptionalIfEmpty()
  @MaxLength(3, {
    message: ErrorFactory.getErrorMessage(ErrorType.FieldTooLong, 'AddressState')
  })
  AddressState: string | undefined;

  // * AddressPostCode
  @IsOptionalIfEmpty()
  @IsNumberString(undefined, {
    message: ErrorFactory.getErrorMessage(ErrorType.NotANumber, 'AddressPostCode')
  })
  @MaxLength(4, {
    message: ErrorFactory.getErrorMessage(ErrorType.FieldTooLong, 'AddressPostCode')
  })
  AddressPostCode: string | undefined;

  // * EmailAddress
  @IsOptionalIfEmpty()
  @MaxLength(255, {
    message: ErrorFactory.getErrorMessage(ErrorType.FieldTooLong, 'EmailAddress')
  })
  @IsEmail(undefined, {
    message: ErrorFactory.getErrorMessage(ErrorType.NotAnEmail, 'EmailAddress')
  })
  EmailAddress: string | undefined;

  // * MobilePhoneNumber
  @IsOptionalIfEmpty()
  @MaxLength(10, {
    message: ErrorFactory.getErrorMessage(ErrorType.FieldTooLong, 'MobilePhoneNumber')
  })
  @IsMobilePhone('en-AU', undefined, {
    message: ErrorFactory.getErrorMessage(ErrorType.NotAMobilePhone, 'MobilePhoneNumber')
  })
  MobilePhoneNumber: string | undefined;

  // * ContractStartDate
  @IsNotEmpty({
    message: ErrorFactory.getErrorMessage(ErrorType.NotEmpty, 'ContractStartDate')
  })
  ContractStartDate: string;

  // * SmsPaymentReminder
  @IsNotEmpty({
    message: ErrorFactory.getErrorMessage(ErrorType.NotEmpty, 'SmsPaymentReminder')
  })
  @IsIn(['YES', 'NO'], {
    message: ErrorFactory.getErrorMessage(ErrorType.NotInAllowedSet, 'SmsPaymentReminder')
  })
  SmsPaymentReminder: string;

  // * SmsFailedNotification
  @IsNotEmpty({
    message: ErrorFactory.getErrorMessage(ErrorType.NotEmpty, 'SmsFailedNotification')
  })
  @IsIn(['YES', 'NO'], {
    message: ErrorFactory.getErrorMessage(ErrorType.NotInAllowedSet, 'SmsFailedNotification')
  })
  SmsFailedNotification: string;

  // * SmsExpiredCard
  @IsNotEmpty({
    message: ErrorFactory.getErrorMessage(ErrorType.NotEmpty, 'SmsExpiredCard')
  })
  @IsIn(['YES', 'NO'], {
    message: ErrorFactory.getErrorMessage(ErrorType.NotInAllowedSet, 'SmsExpiredCard')
  })
  SmsExpiredCard: string;

  // * Username
  @IsOptional()
  @MaxLength(50, {
    message: ErrorFactory.getErrorMessage(ErrorType.FieldTooLong, 'Username')
  })
  Username: string | undefined;
}
