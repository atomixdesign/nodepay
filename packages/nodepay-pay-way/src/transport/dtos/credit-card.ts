import {
  IsNotEmpty,
  Length,
  IsNumberString,
  IsCreditCard,
} from 'class-validator'

import {
  ErrorType,
  ErrorFactory,
} from '@atomixdesign/nodepay-core/build/validation'
import { PaywayCreditCard } from '../../types'

/** @internal */
export class CreditCardDTO {
  constructor(creditCard: PaywayCreditCard) {
    this.paymentMethod = 'creditCard'
    this.cardNumber = creditCard.cardNumber
    this.cardholderName = creditCard.cardHolderName
    this.cvn = creditCard.CCV
    this.expiryDateMonth = creditCard.expiryDateMonth
    this.expiryDateYear = creditCard.expiryDateYear.slice(-2)
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
