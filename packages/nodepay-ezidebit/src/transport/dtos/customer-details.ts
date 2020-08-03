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
import { IEzidebitInternalCustomerDetails } from '../../types'

/** @internal */
export class CustomerDetailsDTO {
  constructor(customerDetails: IEzidebitInternalCustomerDetails) {
    this.YourSystemReference = customerDetails.YourSystemReference
    this.NewYourSystemReference = customerDetails.NewYourSystemReference
    this.YourGeneralReference = customerDetails.YourGeneralReference
    this.LastName = customerDetails.LastName
    this.FirstName = customerDetails.FirstName

    this.AddressLine1 = customerDetails.AddressLine1
    this.AddressLine2 = customerDetails.AddressLine2
    this.AddressSuburb = customerDetails.AddressSuburb
    this.AddressState = customerDetails.AddressState
    this.AddressPostCode = customerDetails.AddressPostCode
    this.EmailAddress = customerDetails.EmailAddress
    this.MobilePhoneNumber = customerDetails.MobilePhoneNumber

    this.SmsPaymentReminder = customerDetails.SmsPaymentReminder
    this.SmsFailedNotification = customerDetails.SmsFailedNotification
    this.SmsExpiredCard = customerDetails.SmsExpiredCard

    this.Username = customerDetails.Username
  }

  // * YourSystemReference
  @MaxLength(50, {
    message: ErrorFactory.getErrorMessage(ErrorType.FieldTooLong, 'YourSystemReference')
  })
  YourSystemReference: string;

  // * NewYourSystemReference
  @MaxLength(50, {
    message: ErrorFactory.getErrorMessage(ErrorType.FieldTooLong, 'NewYourSystemReference')
  })
  NewYourSystemReference: string;

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
  @IsOptional()
  @MaxLength(30, {
    message: ErrorFactory.getErrorMessage(ErrorType.FieldTooLong, 'FirstName')
  })
  FirstName: string | undefined;

  // * AddressLine1
  @IsOptional()
  @MaxLength(30, {
    message: ErrorFactory.getErrorMessage(ErrorType.FieldTooLong, 'AddressLine1')
  })
  AddressLine1: string | undefined;

  // * AddressLine2
  @IsOptional()
  @MaxLength(30, {
    message: ErrorFactory.getErrorMessage(ErrorType.FieldTooLong, 'AddressLine2')
  })
  AddressLine2: string | undefined;

  // * AddressSuburb
  @IsOptional()
  @MaxLength(20, {
    message: ErrorFactory.getErrorMessage(ErrorType.FieldTooLong, 'AddressSuburb')
  })
  AddressSuburb: string | undefined;

  // * AddressState
  @IsOptional()
  @MaxLength(3, {
    message: ErrorFactory.getErrorMessage(ErrorType.FieldTooLong, 'AddressState')
  })
  AddressState: string | undefined;

  // * AddressPostCode
  @IsOptional()
  @IsNumberString(undefined, {
    message: ErrorFactory.getErrorMessage(ErrorType.NotANumber, 'AddressPostCode')
  })
  @MaxLength(4, {
    message: ErrorFactory.getErrorMessage(ErrorType.FieldTooLong, 'AddressPostCode')
  })
  AddressPostCode: string | undefined;

  // * EmailAddress
  @IsOptional()
  @MaxLength(255, {
    message: ErrorFactory.getErrorMessage(ErrorType.FieldTooLong, 'EmailAddress')
  })
  @IsEmail(undefined, {
    message: ErrorFactory.getErrorMessage(ErrorType.NotAnEmail, 'EmailAddress')
  })
  EmailAddress: string | undefined;

  // * MobilePhoneNumber
  @IsOptional()
  @MaxLength(10, {
    message: ErrorFactory.getErrorMessage(ErrorType.FieldTooLong, 'MobilePhoneNumber')
  })
  @IsMobilePhone('en-AU', undefined, {
    message: ErrorFactory.getErrorMessage(ErrorType.NotAMobilePhone, 'MobilePhoneNumber')
  })
  MobilePhoneNumber: string | undefined;

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
