import { BaseDebitDTO } from './base-debit'

import {
  IsNotEmpty,
  IsNumberString,
  MaxLength,
  IsCreditCard,
  Length,
} from 'class-validator'

import {
  ErrorType,
  Errors,
} from '@atomixdesign/nodepay-core/validation/errors'
import { ICreditCardDebit } from '../../types'

export class CardDebitDTO extends BaseDebitDTO {
  constructor(cardDebit: ICreditCardDebit) {
    super(cardDebit)
    this.NameOnCreditCard = cardDebit.NameOnCreditCard
    this.CreditCardNumber = cardDebit.CreditCardNumber
    this.CreditCardExpiryMonth = cardDebit.CreditCardExpiryMonth
    this.CreditCardExpiryYear = cardDebit.CreditCardExpiryYear
  }
  // * NameOnCreditCard
  @IsNotEmpty({
    message: Errors.getErrorMessage(ErrorType.NotEmpty, 'NameOnCreditCard')
  })
  @MaxLength(100, {
    message: Errors.getErrorMessage(ErrorType.FieldTooLong, 'NameOnCreditCard')
  })
  NameOnCreditCard: string;

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
}
