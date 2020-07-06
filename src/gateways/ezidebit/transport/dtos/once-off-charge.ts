import {
  IsNotEmpty,
  IsNumberString,
  IsCreditCard,
  IsNumber,
  MaxLength,
  Length,
} from 'class-validator'

import {
  ErrorType,
  Errors,
} from '@atomixdesign/nodepay/validation/errors'
import { ICreditCardCharge } from '../../types'

export class OnceOffChargeDTO {
  constructor(charge: ICreditCardCharge) {
    this.CreditCardNumber = charge.CreditCardNumber
    this.CreditCardExpiryMonth = charge.CreditCardExpiryMonth
    this.CreditCardExpiryYear = charge.CreditCardExpiryYear
    this.CreditCardCCV = charge.CreditCardCCV
    this.NameOnCreditCard = charge.NameOnCreditCard
    this.PaymentAmountInCents = charge.PaymentAmountInCents
    this.CustomerName = charge.CustomerName
    this.PaymentReference = charge.PaymentReference
  }

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

  // * CreditCardCCV
  @Length(3, 4, {
    message: Errors.getErrorMessage(ErrorType.LengthOutOfBounds, 'CreditCardCCV')
  })
  @IsNumberString(undefined, {
    message: Errors.getErrorMessage(ErrorType.NotANumber, 'CreditCardCCV')
  })
  CreditCardCCV: string;

  // * NameOnCreditCard
  @IsNotEmpty({
    message: Errors.getErrorMessage(ErrorType.NotEmpty, 'NameOnCreditCard')
  })
  @MaxLength(100, {
    message: Errors.getErrorMessage(ErrorType.FieldTooLong, 'NameOnCreditCard')
  })
  NameOnCreditCard: string;

  // * PaymentAmountInCents
  @IsNumber(undefined, {
    message: Errors.getErrorMessage(ErrorType.NotANumber, 'PaymentAmountInCents')
  })
  PaymentAmountInCents: number;

  // * CustomerName
  @MaxLength(255, {
    message: Errors.getErrorMessage(ErrorType.FieldTooLong, 'CustomerName')
  })
  CustomerName = '';

  // * PaymentReference
  @IsNotEmpty({
    message: Errors.getErrorMessage(ErrorType.NotEmpty, 'PaymentReference')
  })
  @MaxLength(50, {
    message: Errors.getErrorMessage(ErrorType.FieldTooLong, 'PaymentReference')
  })
  PaymentReference: string;
}
