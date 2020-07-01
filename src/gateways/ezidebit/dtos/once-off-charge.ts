import {
  IsNotEmpty,
  IsNumberString,
  IsCreditCard,
  IsNumber,
  MaxLength,
  Length,
  IsOptional,
} from 'class-validator'

import {
  ErrorType,
  Errors,
} from '@atomixdesign/nodepay/validation/errors'

export class OnceOffChargeDTO {
  constructor({
    CreditCardNumber,
    CreditCardExpiryMonth,
    CreditCardExpiryYear,
    CreditCardCCV,
    NameOnCreditCard,
    PaymentAmountInCents,
    PaymentReference,
    CustomerName,
  } :
  {
    CreditCardNumber: string
    CreditCardExpiryMonth: string
    CreditCardExpiryYear: string
    CreditCardCCV: string
    NameOnCreditCard: string
    PaymentAmountInCents: number
    PaymentReference: string
    CustomerName?: string
  }) {
    this.CreditCardNumber = CreditCardNumber
    this.CreditCardExpiryMonth = CreditCardExpiryMonth
    this.CreditCardExpiryYear = CreditCardExpiryYear
    this.CreditCardCCV = CreditCardCCV
    this.NameOnCreditCard = NameOnCreditCard
    this.PaymentAmountInCents = PaymentAmountInCents
    this.PaymentReference = PaymentReference
    this.CustomerName = CustomerName
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
    message: Errors.getErrorMessage(ErrorType.NumberRequired, 'CreditCardExpiryMonth')
  })
  CreditCardExpiryMonth: string;

  // * CreditCardExpiryYear
  @Length(4, 4, {
    message: Errors.getErrorMessage(ErrorType.LengthOutOfBounds, 'CreditCardExpiryYear')
  })
  @IsNumberString(undefined, {
    message: Errors.getErrorMessage(ErrorType.NumberRequired, 'CreditCardExpiryYear')
  })
  CreditCardExpiryYear: string;

  // * CreditCardCCV
  @IsNotEmpty({
    message: Errors.getErrorMessage(ErrorType.NotEmpty, 'CreditCardCCV')
  })
  @Length(3, 4, {
    message: Errors.getErrorMessage(ErrorType.LengthOutOfBounds, 'CreditCardCCV')
  })
  @IsNumberString(undefined, {
    message: Errors.getErrorMessage(ErrorType.NumberRequired, 'CreditCardCCV')
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
    message: Errors.getErrorMessage(ErrorType.NumberRequired, 'PaymentAmountInCents')
  })
  PaymentAmountInCents: number;

  // * PaymentReference
  @IsNotEmpty({
    message: Errors.getErrorMessage(ErrorType.NotEmpty, 'PaymentReference')
  })
  @MaxLength(50, {
    message: Errors.getErrorMessage(ErrorType.FieldTooLong, 'PaymentReference')
  })
  PaymentReference: string;

  // * CustomerName
  @IsOptional()
  @MaxLength(255, {
    message: Errors.getErrorMessage(ErrorType.FieldTooLong, 'CustomerName')
  })
  CustomerName: string | undefined;
}
