import { INewCreditCard } from '../types'
import { IsNotEmpty, IsCreditCard, MaxLength, Length, IsNumberString, IsOptional, IsIn } from 'class-validator'
import { Errors, ErrorType } from '@atomixdesign/nodepay/validation/errors'

export class CreditCardDTO {
  constructor(creditCard: INewCreditCard) {
    if (creditCard.YourSystemReference === undefined)
      this.EziDebitCustomerID = creditCard.EziDebitCustomerID
    this.CreditCardNumber = creditCard.CreditCardNumber
    this.CreditCardExpiryMonth = creditCard.CreditCardExpiryMonth
    this.CreditCardExpiryYear = creditCard.CreditCardExpiryYear
    this.NameOnCreditCard = creditCard.NameOnCreditCard
    this.Reactivate = creditCard.Reactivate
    if (creditCard.EziDebitCustomerID === undefined)
      this.YourSystemReference = creditCard.YourSystemReference
    this.Username = creditCard.Username
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

  // * CreditCardNumber
  @IsNotEmpty({
    message: Errors.getErrorMessage(ErrorType.NotEmpty, 'CreditCardNumber')
  })
  @IsCreditCard({
    message: Errors.getErrorMessage(ErrorType.NotACreditCard, 'CreditCardNumber')
  })
  @MaxLength(16, {
    message: Errors.getErrorMessage(ErrorType.FieldTooLong, 'CreditCardNumber')
  })
  CreditCardNumber: string;

  // * CreditCardExpiryMonth
  @Length(2, 2, {
    message: Errors.getErrorMessage(ErrorType.LengthOutOfBounds, 'CreditCardExpiryMonth')
  })
  @IsNumberString(undefined, {
    message: Errors.getErrorMessage(ErrorType.NotANumber, 'CreditCardExpiryMonth')
  })
  CreditCardExpiryMonth: string;

  // * CreditCardExpiryYear
  @Length(4, 4, {
    message: Errors.getErrorMessage(ErrorType.LengthOutOfBounds, 'CreditCardExpiryYear')
  })
  @IsNumberString(undefined, {
    message: Errors.getErrorMessage(ErrorType.NotANumber, 'CreditCardExpiryYear')
  })
  CreditCardExpiryYear: string;

  // * NameOnCreditCard
  @IsNotEmpty({
    message: Errors.getErrorMessage(ErrorType.NotEmpty, 'NameOnCreditCard')
  })
  @MaxLength(100, {
    message: Errors.getErrorMessage(ErrorType.FieldTooLong, 'NameOnCreditCard')
  })
  NameOnCreditCard: string;

  // * Reactivate
  @IsNotEmpty({
    message: Errors.getErrorMessage(ErrorType.NotEmpty, 'Reactivate')
  })
  @IsIn(['YES', 'NO'], {
    message: Errors.getErrorMessage(ErrorType.NotInAllowedSet, 'Reactivate')
  })
  Reactivate: string

  // * YourSystemReference
  @IsOptional()
  @MaxLength(50, {
    message: Errors.getErrorMessage(ErrorType.FieldTooLong, 'YourSystemReference')
  })
  YourSystemReference: string | undefined;

  // * Username
  @IsOptional()
  @MaxLength(50, {
    message: Errors.getErrorMessage(ErrorType.FieldTooLong, 'Username')
  })
  Username: string | undefined;
}
