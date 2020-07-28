import {
  IsNotEmpty,
  IsCreditCard,
  MaxLength,
  Length,
  IsNumberString,
} from 'class-validator'

import { ErrorFactory, ErrorType } from '@atomixdesign/nodepay-core/validation'
import { ICreditCard } from '@atomixdesign/nodepay-core/types'

export class CreditCardDTO {
  constructor(creditCard: ICreditCard) {
    this.CardHolderName = creditCard.cardHolderName
    this.CardNumber = creditCard.cardNumber
    this.Cvn = creditCard.CCV
    this.ExpiryDate = `${creditCard.expiryDateMonth}${creditCard.expiryDateYear.slice(-2)}`
  }

  // * CardHolderName
  @IsNotEmpty({
    message: ErrorFactory.getErrorMessage(ErrorType.NotEmpty, 'CardHolderName')
  })
  @MaxLength(50, {
    message: ErrorFactory.getErrorMessage(ErrorType.FieldTooLong, 'CardHolderName')
  })
  CardHolderName: string;

  // * CreditCardNumber
  @IsNotEmpty({
    message: ErrorFactory.getErrorMessage(ErrorType.NotEmpty, 'CreditCardNumber')
  })
  @IsCreditCard({
    message: ErrorFactory.getErrorMessage(ErrorType.NotACreditCard, 'CreditCardNumber')
  })
  @Length(13, 16, {
    message: ErrorFactory.getErrorMessage(ErrorType.LengthOutOfBounds, 'CreditCardNumber')
  })
  CardNumber: string;

  // Cvn
  @Length(3, 4, {
    message: ErrorFactory.getErrorMessage(ErrorType.LengthOutOfBounds, 'Cvn')
  })
  @IsNumberString(undefined, {
    message: ErrorFactory.getErrorMessage(ErrorType.NotANumber, 'Cvn')
  })
  Cvn: string;

  // ExpiryDate - MMYY
  @Length(4, 4, {
    message: ErrorFactory.getErrorMessage(ErrorType.LengthOutOfBounds, 'ExpiryDate')
  })
  @IsNumberString(undefined, {
    message: ErrorFactory.getErrorMessage(ErrorType.NotANumber, 'ExpiryDate')
  })
  ExpiryDate: string;
}
