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
  ErrorFactory,
} from '@atomixdesign/nodepay-core/validation/errors'
import { IEzidebitCreditCardDebit } from '../../types'

export class CardDebitDTO extends BaseDebitDTO {
  constructor(cardDebit: IEzidebitCreditCardDebit) {
    super(cardDebit)
    this.NameOnCreditCard = cardDebit.NameOnCreditCard
    this.CreditCardNumber = cardDebit.CreditCardNumber
    this.CreditCardExpiryMonth = cardDebit.CreditCardExpiryMonth
    this.CreditCardExpiryYear = cardDebit.CreditCardExpiryYear
  }
  // * NameOnCreditCard
  @IsNotEmpty({
    message: ErrorFactory.getErrorMessage(ErrorType.NotEmpty, 'NameOnCreditCard')
  })
  @MaxLength(100, {
    message: ErrorFactory.getErrorMessage(ErrorType.FieldTooLong, 'NameOnCreditCard')
  })
  NameOnCreditCard: string;

  // * CreditCardNumber
  @IsNotEmpty({
    message: ErrorFactory.getErrorMessage(ErrorType.NotEmpty, 'CreditCardNumber')
  })
  @IsCreditCard({
    message: ErrorFactory.getErrorMessage(ErrorType.NotACreditCard, 'CreditCardNumber')
  })
  @MaxLength(16, {
    message: ErrorFactory.getErrorMessage(ErrorType.FieldTooLong, 'CreditCardNumber')
  })
  CreditCardNumber: string;

  // * CreditCardExpiryMonth
  @Length(2, 2, {
    message: ErrorFactory.getErrorMessage(ErrorType.LengthOutOfBounds, 'CreditCardExpiryMonth')
  })
  @IsNumberString(undefined, {
    message: ErrorFactory.getErrorMessage(ErrorType.NotANumber, 'CreditCardExpiryMonth')
  })
  CreditCardExpiryMonth: string;

  // * CreditCardExpiryYear
  @Length(4, 4, {
    message: ErrorFactory.getErrorMessage(ErrorType.LengthOutOfBounds, 'CreditCardExpiryYear')
  })
  @IsNumberString(undefined, {
    message: ErrorFactory.getErrorMessage(ErrorType.NotANumber, 'CreditCardExpiryYear')
  })
  CreditCardExpiryYear: string;
}
