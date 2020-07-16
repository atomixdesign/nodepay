import {
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
} from '@atomixdesign/nodepay-core/validation/errors'
import { ICustomer } from '../../types'

export class CustomerDTO {
  constructor(customer: ICustomer) {
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
  @IsNotEmpty({
    message: ErrorFactory.getErrorMessage(ErrorType.NotEmpty, 'YourSystemReference')
  })
  @MaxLength(50, {
    message: ErrorFactory.getErrorMessage(ErrorType.FieldTooLong, 'YourSystemReference')
  })
  YourSystemReference: string;

  // * YourGeneralReference
  @MaxLength(50, {
    message: ErrorFactory.getErrorMessage(ErrorType.FieldTooLong, 'YourGeneralReference')
  })
  YourGeneralReference = '';

  // * LastName
  @IsNotEmpty({
    message: ErrorFactory.getErrorMessage(ErrorType.NotEmpty, 'LastName')
  })
  @MaxLength(60, {
    message: ErrorFactory.getErrorMessage(ErrorType.FieldTooLong, 'LastName')
  })
  LastName: string;

  // * FirstName
  @MaxLength(30, {
    message: ErrorFactory.getErrorMessage(ErrorType.FieldTooLong, 'FirstName')
  })
  FirstName = '';

  // * AddressLine1
  @MaxLength(30, {
    message: ErrorFactory.getErrorMessage(ErrorType.FieldTooLong, 'AddressLine1')
  })
  AddressLine1 = '';

  // * AddressLine2
  @MaxLength(30, {
    message: ErrorFactory.getErrorMessage(ErrorType.FieldTooLong, 'AddressLine2')
  })
  AddressLine2 = '';

  // * AddressSuburb
  @MaxLength(20, {
    message: ErrorFactory.getErrorMessage(ErrorType.FieldTooLong, 'AddressSuburb')
  })
  AddressSuburb = '';

  // * AddressState
  @MaxLength(3, {
    message: ErrorFactory.getErrorMessage(ErrorType.FieldTooLong, 'AddressState')
  })
  AddressState = '';

  // * AddressPostCode
  @IsNumberString(undefined, {
    message: ErrorFactory.getErrorMessage(ErrorType.NotANumber, 'AddressPostCode')
  })
  @MaxLength(4, {
    message: ErrorFactory.getErrorMessage(ErrorType.FieldTooLong, 'AddressPostCode')
  })
  AddressPostCode = '';

  // * EmailAddress
  @MaxLength(255, {
    message: ErrorFactory.getErrorMessage(ErrorType.FieldTooLong, 'EmailAddress')
  })
  @IsEmail(undefined, {
    message: ErrorFactory.getErrorMessage(ErrorType.NotAnEmail, 'EmailAddress')
  })
  EmailAddress = '';

  // * MobilePhoneNumber
  @MaxLength(10, {
    message: ErrorFactory.getErrorMessage(ErrorType.FieldTooLong, 'MobilePhoneNumber')
  })
  @IsMobilePhone('en-AU', undefined, {
    message: ErrorFactory.getErrorMessage(ErrorType.NotAMobilePhone, 'MobilePhoneNumber')
  })
  MobilePhoneNumber = '';

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
  @MaxLength(50, {
    message: ErrorFactory.getErrorMessage(ErrorType.FieldTooLong, 'Username')
  })
  Username = '';
}
