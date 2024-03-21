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
  ErrorFactory,
} from '@atomixdesign/nodepay-core/build/validation'
import { IEzidebitCreditCardCharge } from '../../types'

import debug from 'debug'

const log = debug('nodepay:ezidebit')

/** @internal */
export class OnceOffChargeDTO {
  constructor(charge: IEzidebitCreditCardCharge) {
    log(`building ${this.constructor.name}`)
    log({ charge })
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
    message: ErrorFactory.getErrorMessage(ErrorType.NotEmpty, 'CreditCardNumber'),
  })
  @IsCreditCard({
    message: ErrorFactory.getErrorMessage(ErrorType.NotACreditCard, 'CreditCardNumber'),
  })
  @MaxLength(16, {
    message: ErrorFactory.getErrorMessage(ErrorType.FieldTooLong, 'CreditCardNumber'),
  })
  CreditCardNumber: string;

  // * CreditCardExpiryMonth
  @Length(2, 2, {
    message: ErrorFactory.getErrorMessage(ErrorType.LengthOutOfBounds, 'CreditCardExpiryMonth'),
  })
  @IsNumberString(undefined, {
    message: ErrorFactory.getErrorMessage(ErrorType.NotANumber, 'CreditCardExpiryMonth'),
  })
  CreditCardExpiryMonth: string;

  // * CreditCardExpiryYear
  @Length(4, 4, {
    message: ErrorFactory.getErrorMessage(ErrorType.LengthOutOfBounds, 'CreditCardExpiryYear'),
  })
  @IsNumberString(undefined, {
    message: ErrorFactory.getErrorMessage(ErrorType.NotANumber, 'CreditCardExpiryYear'),
  })
  CreditCardExpiryYear: string;

  // * CreditCardCCV
  @Length(3, 4, {
    message: ErrorFactory.getErrorMessage(ErrorType.LengthOutOfBounds, 'CreditCardCCV'),
  })
  @IsNumberString(undefined, {
    message: ErrorFactory.getErrorMessage(ErrorType.NotANumber, 'CreditCardCCV'),
  })
  CreditCardCCV: string;

  // * NameOnCreditCard
  @IsNotEmpty({
    message: ErrorFactory.getErrorMessage(ErrorType.NotEmpty, 'NameOnCreditCard'),
  })
  @MaxLength(100, {
    message: ErrorFactory.getErrorMessage(ErrorType.FieldTooLong, 'NameOnCreditCard'),
  })
  NameOnCreditCard: string;

  // * PaymentAmountInCents
  @IsNumber(undefined, {
    message: ErrorFactory.getErrorMessage(ErrorType.NotANumber, 'PaymentAmountInCents'),
  })
  PaymentAmountInCents: number;

  // * CustomerName
  @MaxLength(255, {
    message: ErrorFactory.getErrorMessage(ErrorType.FieldTooLong, 'CustomerName'),
  })
  CustomerName = '';

  // * PaymentReference
  @IsNotEmpty({
    message: ErrorFactory.getErrorMessage(ErrorType.NotEmpty, 'PaymentReference'),
  })
  @MaxLength(50, {
    message: ErrorFactory.getErrorMessage(ErrorType.FieldTooLong, 'PaymentReference'),
  })
  PaymentReference: string;
}
