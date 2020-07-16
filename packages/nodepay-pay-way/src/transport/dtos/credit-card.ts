import {
  IsNotEmpty,
  Length,
  IsNumberString,
  IsCreditCard,
} from 'class-validator'

import {
  ErrorType,
  ErrorFactory,
} from '@atomixdesign/nodepay-core/validation/errors'

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
    message: ErrorFactory.getErrorMessage(ErrorType.NotEmpty, 'cardNumber')
  })
  @IsCreditCard({
    message: ErrorFactory.getErrorMessage(ErrorType.NotACreditCard, 'cardNumber')
  })
  cardNumber: string;

  // * cardholderName
  @IsNotEmpty({
    message: ErrorFactory.getErrorMessage(ErrorType.NotEmpty, 'cardholderName')
  })
  cardholderName: string;

  // * cvn
  @Length(3, 4, {
    message: ErrorFactory.getErrorMessage(ErrorType.LengthOutOfBounds, 'cvn')
  })
  @IsNumberString(undefined, {
    message: ErrorFactory.getErrorMessage(ErrorType.NotANumber, 'cvn')
  })
  cvn: string;

  // * expiryDateMonth
  @Length(2, 2, {
    message: ErrorFactory.getErrorMessage(ErrorType.LengthOutOfBounds, 'expiryDateMonth')
  })
  @IsNumberString(undefined, {
    message: ErrorFactory.getErrorMessage(ErrorType.NotANumber, 'expiryDateMonth')
  })
  expiryDateMonth: string;

  // * expiryDateYear
  @Length(2, 2, {
    message: ErrorFactory.getErrorMessage(ErrorType.LengthOutOfBounds, 'expiryDateYear')
  })
  @IsNumberString(undefined, {
    message: ErrorFactory.getErrorMessage(ErrorType.NotANumber, 'expiryDateYear')
  })
  expiryDateYear: string;
}
