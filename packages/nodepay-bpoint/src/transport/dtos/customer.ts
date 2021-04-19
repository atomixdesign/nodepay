import {
  ValidateNested, IsOptional, IsNotEmpty, MaxLength, IsEmail,
} from 'class-validator'

import {
  ErrorType,
  ErrorFactory,
} from '@atomixdesign/nodepay-core/validation'
import {
  IBPOINTInternalCustomer,
  IBPOINTInternalAddress,
  IBPOINTInternalContactDetails,
  IBPOINTInternalPersonalDetails,
  BPOINTCreditCard,
  BPOINTBankAccount,
} from '../../types'
import { CreditCardDTO } from './credit-card'
import { BankAccountDTO } from './bank-account'

import debug from 'debug'
const log = debug('nodepay:bpoint')

/** @internal */
export class CustomerDTO {
  constructor(
    customer: IBPOINTInternalCustomer,
    creditCard?: BPOINTCreditCard,
    bankAccount?: BPOINTBankAccount,
  ) {
    log(`building ${this.constructor.name}`)
    log({ customer })
    this.CardDetails = creditCard && new CreditCardDTO(creditCard)
    this.BankAccountDetails = bankAccount && new BankAccountDTO(bankAccount)
    this.Crn1 = customer.Crn1
    this.EmailAddress = customer.EmailAddress
    this.Customer.Address = new AddressDTO({
      AddressLine1: customer.AddressLine1,
      AddressLine2: customer.AddressLine2,
      PostCode: customer.PostCode,
      State: customer.State,
    })
    this.Customer.ContactDetails = new ContactDetailsDTO({
      EmailAddress: customer.EmailAddress,
      HomePhoneNumber: customer.HomePhoneNumber,
    })
    this.Customer.PersonalDetails = new PersonalDetailsDTO({
      FirstName: customer.FirstName,
      LastName: customer.LastName,
    })
  }

  // * CardDetails
  @IsOptional()
  @ValidateNested()
  CardDetails: CreditCardDTO | undefined;

  // * BankAccountDetails
  @IsOptional()
  @ValidateNested()
  BankAccountDetails: BankAccountDTO | undefined;

  // * Crn1
  @IsNotEmpty({
    message: ErrorFactory.getErrorMessage(ErrorType.NotEmpty, 'Crn1')
  })
  @MaxLength(50, {
    message: ErrorFactory.getErrorMessage(ErrorType.FieldTooLong, 'Crn1')
  })
  Crn1: string;

  // * AcceptBADirectDebitTC
  // TODO: ensure proper information to customer prior to collecting details.
  AcceptBADirectDebitTC = true;

  // * EmailAddress
  @IsNotEmpty({
    message: ErrorFactory.getErrorMessage(ErrorType.NotEmpty, 'EmailAddress')
  })
  @IsEmail(undefined, {
    message: ErrorFactory.getErrorMessage(ErrorType.NotAnEmail, 'EmailAddress')
  })
  @MaxLength(250, {
    message: ErrorFactory.getErrorMessage(ErrorType.FieldTooLong, 'EmailAddress')
  })
  EmailAddress: string;

  @IsOptional()
  @ValidateNested()
  Customer: {
    Address?: AddressDTO
    ContactDetails?: ContactDetailsDTO
    PersonalDetails?: PersonalDetailsDTO
  } = {};
}

/** @internal */
export class AddressDTO {
  constructor(addressDetails: IBPOINTInternalAddress) {
    this.AddressLine1 = addressDetails.AddressLine1
    this.AddressLine2 = addressDetails.AddressLine2
    this.City = addressDetails.City
    this.CountryCode = addressDetails.CountryCode
    this.PostCode = addressDetails.PostCode
    this.State = addressDetails.State
  }

  // * AddressLine1
  @IsOptional()
  @IsNotEmpty({
    message: ErrorFactory.getErrorMessage(ErrorType.NotEmpty, 'AddressLine1')
  })
  AddressLine1: string | undefined;

  // * AddressLine2
  @IsOptional()
  @IsNotEmpty({
    message: ErrorFactory.getErrorMessage(ErrorType.NotEmpty, 'AddressLine2')
  })
  AddressLine2: string | undefined;

  // * City
  @IsOptional()
  @IsNotEmpty({
    message: ErrorFactory.getErrorMessage(ErrorType.NotEmpty, 'City')
  })
  City: string | undefined;

  // * CountryCode
  @IsOptional()
  @IsNotEmpty({
    message: ErrorFactory.getErrorMessage(ErrorType.NotEmpty, 'CountryCode')
  })
  CountryCode: string | undefined;

  // * PostCode
  @IsOptional()
  @IsNotEmpty({
    message: ErrorFactory.getErrorMessage(ErrorType.NotEmpty, 'PostCode')
  })
  PostCode: string | undefined;

  // * State
  @IsOptional()
  @IsNotEmpty({
    message: ErrorFactory.getErrorMessage(ErrorType.NotEmpty, 'State')
  })
  State: string | undefined;
}

/** @internal */
export class ContactDetailsDTO {
  constructor(contactDetails: IBPOINTInternalContactDetails) {
    this.EmailAddress = contactDetails.EmailAddress
    this.FaxNumber = contactDetails.FaxNumber
    this.HomePhoneNumber = contactDetails.HomePhoneNumber
    this.MobilePhoneNumber = contactDetails.MobilePhoneNumber
    this.WorkPhoneNumber = contactDetails.WorkPhoneNumber
  }

  // * EmailAddress
  @IsOptional()
  @IsNotEmpty({
    message: ErrorFactory.getErrorMessage(ErrorType.NotEmpty, 'EmailAddress')
  })
  @IsEmail(undefined, {
    message: ErrorFactory.getErrorMessage(ErrorType.NotAnEmail, 'EmailAddress')
  })
  @MaxLength(250, {
    message: ErrorFactory.getErrorMessage(ErrorType.FieldTooLong, 'EmailAddress')
  })
  EmailAddress: string | undefined;

  // * FaxNumber
  @IsOptional()
  @IsNotEmpty({
    message: ErrorFactory.getErrorMessage(ErrorType.NotEmpty, 'FaxNumber')
  })
  FaxNumber: string | undefined;

  // * HomePhoneNumber
  @IsOptional()
  @IsNotEmpty({
    message: ErrorFactory.getErrorMessage(ErrorType.NotEmpty, 'HomePhoneNumber')
  })
  HomePhoneNumber: string | undefined;

  // * MobilePhoneNumber
  @IsOptional()
  @IsNotEmpty({
    message: ErrorFactory.getErrorMessage(ErrorType.NotEmpty, 'MobilePhoneNumber')
  })
  MobilePhoneNumber: string | undefined;

  // * WorkPhoneNumber
  @IsOptional()
  @IsNotEmpty({
    message: ErrorFactory.getErrorMessage(ErrorType.NotEmpty, 'WorkPhoneNumber')
  })
  WorkPhoneNumber: string | undefined;
}

/** @internal */
export class PersonalDetailsDTO {
  constructor(personalDetails: IBPOINTInternalPersonalDetails) {
    this.DateOfBirth = personalDetails.DateOfBirth
    this.FirstName = personalDetails.FirstName
    this.LastName = personalDetails.LastName
    this.MiddleName = personalDetails.MiddleName
    this.Salutation = personalDetails.Salutation
  }

  // * DateOfBirth
  @IsOptional()
  @IsNotEmpty({
    message: ErrorFactory.getErrorMessage(ErrorType.NotEmpty, 'DateOfBirth')
  })
  DateOfBirth: string | undefined;

  // * FirstName
  @IsOptional()
  @IsNotEmpty({
    message: ErrorFactory.getErrorMessage(ErrorType.NotEmpty, 'FirstName')
  })
  FirstName: string | undefined;

  // * LastName
  @IsOptional()
  @IsNotEmpty({
    message: ErrorFactory.getErrorMessage(ErrorType.NotEmpty, 'LastName')
  })
  LastName: string | undefined;

  // * MiddleName
  @IsOptional()
  @IsNotEmpty({
    message: ErrorFactory.getErrorMessage(ErrorType.NotEmpty, 'MiddleName')
  })
  MiddleName: string | undefined;

  // * Salutation
  @IsOptional()
  @IsNotEmpty({
    message: ErrorFactory.getErrorMessage(ErrorType.NotEmpty, 'Salutation')
  })
  Salutation: string | undefined;
}
