import {
  IsNotEmpty,
  IsNumberString,
  IsCreditCard,
  IsNumber,
  MaxLength,
  Length,
  IsOptional,
  Min,
  IsIn,
  IsEmail,
  IsMobilePhone,
} from 'class-validator'

import {
  ErrorType,
  Errors,
} from '@atomixdesign/nodepay/validation/errors'
import { ICustomer } from '../types'

export class CustomerDTO {
  constructor(customer: ICustomer) {
    this.LastName = customer.LastName
    this.ContractStartDate = customer.ContractStartDate
    this.SmsPaymentReminder = customer.SmsPaymentReminder
    this.SmsFailedNotification = customer.SmsFailedNotification
    this.SmsExpiredCard = customer.SmsExpiredCard
    this.YourSystemReference = customer.YourSystemReference
    this.YourGeneralReference = customer.YourGeneralReference
    this.FirstName = customer.FirstName
    this.AddressLine1 = customer.AddressLine1
    this.AddressLine2 = customer.AddressLine2
    this.AddressSuburb = customer.AddressSuburb
    this.AddressState = customer.AddressState
    this.AddressPostCode = customer.AddressPostCode
    this.EmailAddress = customer.EmailAddress
    this.MobilePhoneNumber = customer.MobilePhoneNumber
    this.Username = customer.Username
  }
  // * LastName
  @IsNotEmpty({
    message: Errors.getErrorMessage(ErrorType.NotEmpty, 'LastName')
  })
  @MaxLength(60, {
    message: Errors.getErrorMessage(ErrorType.FieldTooLong, 'LastName')
  })
  LastName: string;

  // * ContractStartDate
  @IsNotEmpty({
    message: Errors.getErrorMessage(ErrorType.NotEmpty, 'ContractStartDate')
  })
  ContractStartDate: string;

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

  // * YourSystemReference
  @IsNotEmpty({
    message: Errors.getErrorMessage(ErrorType.NotEmpty, 'YourSystemReference')
  })
  @MaxLength(50, {
    message: Errors.getErrorMessage(ErrorType.FieldTooLong, 'YourSystemReference')
  })
  YourSystemReference: string;

  // * YourGeneralReference
  @IsOptional()
  @MaxLength(50, {
    message: Errors.getErrorMessage(ErrorType.FieldTooLong, 'YourGeneralReference')
  })
  YourGeneralReference: string | undefined;

  // * FirstName
  @IsOptional()
  @MaxLength(30, {
    message: Errors.getErrorMessage(ErrorType.FieldTooLong, 'FirstName')
  })
  FirstName: string | undefined;

  // * AddressLine1
  @IsOptional()
  @MaxLength(30, {
    message: Errors.getErrorMessage(ErrorType.FieldTooLong, 'AddressLine1')
  })
  AddressLine1: string | undefined;

  // * AddressLine2
  @IsOptional()
  @MaxLength(30, {
    message: Errors.getErrorMessage(ErrorType.FieldTooLong, 'AddressLine2')
  })
  AddressLine2: string | undefined;

  // * AddressSuburb
  @IsOptional()
  @MaxLength(20, {
    message: Errors.getErrorMessage(ErrorType.FieldTooLong, 'AddressSuburb')
  })
  AddressSuburb: string | undefined;

  // * AddressState
  @IsOptional()
  @MaxLength(3, {
    message: Errors.getErrorMessage(ErrorType.FieldTooLong, 'AddressState')
  })
  AddressState: string | undefined;

  // * AddressPostCode
  @IsOptional()
  @IsNumberString(undefined, {
    message: Errors.getErrorMessage(ErrorType.NotANumber, 'AddressPostCode')
  })
  @MaxLength(4, {
    message: Errors.getErrorMessage(ErrorType.FieldTooLong, 'AddressPostCode')
  })
  AddressPostCode: string | undefined;

  // * EmailAddress
  @IsOptional()
  @MaxLength(255, {
    message: Errors.getErrorMessage(ErrorType.FieldTooLong, 'EmailAddress')
  })
  @IsEmail(undefined, {
    message: Errors.getErrorMessage(ErrorType.NotAnEmail, 'EmailAddress')
  })
  EmailAddress: string | undefined;

  // * MobilePhoneNumber
  @IsOptional()
  @MaxLength(10, {
    message: Errors.getErrorMessage(ErrorType.FieldTooLong, 'MobilePhoneNumber')
  })
  @IsMobilePhone('en-AU', undefined, {
    message: Errors.getErrorMessage(ErrorType.NotAMobilePhone, 'MobilePhoneNumber')
  })
  MobilePhoneNumber: string | undefined;

  // * Username
  @IsOptional()
  Username: string | undefined;
}
