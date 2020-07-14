import { ICreditCard } from '../../types'
import {
  IsNotEmpty,
  IsCreditCard,
  MaxLength,
  Length,
  IsNumberString,
} from 'class-validator'
import { Errors, ErrorType } from '@atomixdesign/nodepay/validation/errors'

export class CreditCardDTO {
  constructor(creditCard: ICreditCard) {
    this.CardHolderName = creditCard.CardHolderName
    this.CardNumber = creditCard.CardNumber
    this.Cvn = creditCard.Cvn
    this.ExpiryDate = creditCard.ExpiryDate
  }

  // * CardHolderName
  @IsNotEmpty({
    message: Errors.getErrorMessage(ErrorType.NotEmpty, 'CardHolderName')
  })
  @MaxLength(50, {
    message: Errors.getErrorMessage(ErrorType.FieldTooLong, 'CardHolderName')
  })
  CardHolderName: string;

  // * CreditCardNumber
  @IsNotEmpty({
    message: Errors.getErrorMessage(ErrorType.NotEmpty, 'CreditCardNumber')
  })
  @IsCreditCard({
    message: Errors.getErrorMessage(ErrorType.NotACreditCard, 'CreditCardNumber')
  })
  @Length(13, 16, {
    message: Errors.getErrorMessage(ErrorType.LengthOutOfBounds, 'CreditCardNumber')
  })
  CardNumber: string;

  // Cvn
  @Length(3, 4, {
    message: Errors.getErrorMessage(ErrorType.LengthOutOfBounds, 'Cvn')
  })
  @IsNumberString(undefined, {
    message: Errors.getErrorMessage(ErrorType.NotANumber, 'Cvn')
  })
  Cvn: string;

  // ExpiryDate - MMYY
  @Length(4, 4, {
    message: Errors.getErrorMessage(ErrorType.LengthOutOfBounds, 'ExpiryDate')
  })
  @IsNumberString(undefined, {
    message: Errors.getErrorMessage(ErrorType.NotANumber, 'ExpiryDate')
  })
  ExpiryDate: string;
}
