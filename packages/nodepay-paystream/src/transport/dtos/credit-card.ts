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
import { PaystreamCreditCard } from '../../types'

import debug from 'debug'
const log = debug('nodepay:paystream')

/** @internal */
export class CreditCardDTO {
  constructor(creditCard: PaystreamCreditCard) {
    log(`building ${this.constructor.name}`)
    log({ creditCard })
    this.card_number = creditCard.cardNumber
    this.card_holder = creditCard.cardHolderName
    this.cvv = creditCard.CCV
    this.card_expiry = `${creditCard.expiryDateMonth}/${creditCard.expiryDateYear}`
  }

  // * card_number
  @IsNotEmpty({
    message: ErrorFactory.getErrorMessage(ErrorType.NotEmpty, 'card_number')
  })
  @IsCreditCard({
    message: ErrorFactory.getErrorMessage(ErrorType.NotACreditCard, 'card_number')
  })
  readonly card_number: string;

  // * card_holder
  @IsNotEmpty({
    message: ErrorFactory.getErrorMessage(ErrorType.NotEmpty, 'card_holder')
  })
  readonly card_holder: string;

  // * cvv
  @Length(3, 4, {
    message: ErrorFactory.getErrorMessage(ErrorType.LengthOutOfBounds, 'cvv')
  })
  /* @IsNumberString(undefined, {
    message: ErrorFactory.getErrorMessage(ErrorType.NotANumber, 'cvv')
  }) */
  readonly cvv: string;

  // * card_expiry
  @Length(7, 7, {
    message: ErrorFactory.getErrorMessage(ErrorType.LengthOutOfBounds, 'card_expiry')
  })
  readonly card_expiry: string;
}
