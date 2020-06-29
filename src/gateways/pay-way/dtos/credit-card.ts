import {
  IsNotEmpty,
  Length,
  IsNumberString,
  IsCreditCard,
} from 'class-validator'

import {
  ErrorType,
  Errors,
} from '../errors'

export class CreditCardDTO {
  constructor(
    {
      cardNumber,
      cardholderName,
      cvn,
      expiryDateMonth,
      expiryDateYear,
    } :
    {
    cardNumber: string
    cardholderName: string
    cvn: string
    expiryDateMonth: string
    expiryDateYear: string
  }) {
    this.paymentMethod = 'creditCard'
    this.cardNumber = cardNumber
    this.cardholderName = cardholderName
    this.cvn = cvn
    this.expiryDateMonth = expiryDateMonth
    this.expiryDateYear = expiryDateYear
  }

  // * paymentMethod
  paymentMethod: string;

  // * cardNumber
  @IsNotEmpty({
    message: Errors.getErrorMessage(ErrorType.NotEmpty, 'cardNumber')
  })
  @IsCreditCard({
    message: Errors.getErrorMessage(ErrorType.NotACreditCard, 'cardNumber')
  })
  cardNumber: string;

  // * cardholderName
  @IsNotEmpty({
    message: Errors.getErrorMessage(ErrorType.NotEmpty, 'cardholderName')
  })
  cardholderName: string;

  // * cvn
  @Length(3, 4, {
    message: Errors.getErrorMessage(ErrorType.LengthOutOfBounds, 'cvn')
  })
  @IsNumberString(undefined, {
    message: Errors.getErrorMessage(ErrorType.NumberRequired, 'cvn')
  })
  cvn: string;

  // * expiryDateMonth
  @Length(2, 2, {
    message: Errors.getErrorMessage(ErrorType.LengthOutOfBounds, 'expiryDateMonth')
  })
  @IsNumberString(undefined, {
    message: Errors.getErrorMessage(ErrorType.NumberRequired, 'expiryDateMonth')
  })
  expiryDateMonth: string;

  // * expiryDateYear
  @Length(2, 2, {
    message: Errors.getErrorMessage(ErrorType.LengthOutOfBounds, 'expiryDateYear')
  })
  @IsNumberString(undefined, {
    message: Errors.getErrorMessage(ErrorType.NumberRequired, 'expiryDateYear')
  })
  expiryDateYear: string;
}
