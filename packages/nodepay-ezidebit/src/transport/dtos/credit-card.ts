import {
  IsNotEmpty,
  IsCreditCard,
  MaxLength,
  Length,
  IsNumberString,
  IsIn,
} from 'class-validator'
import { IsOptionalIfEmpty } from './IsOptionalIfEmpty'
import { ErrorFactory, ErrorType } from '@atomixdesign/nodepay-core/build/validation'
import { IEzidebitNewCreditCard } from '../../types'
import moment from 'moment'

import debug from 'debug'
const log = debug('nodepay:ezidebit')

/** @internal */
export class CreditCardDTO {
  constructor(creditCard: IEzidebitNewCreditCard) {
    log(`building ${this.constructor.name}`)
    log({ creditCard })
    if (!creditCard.YourSystemReference)
      this.EziDebitCustomerID = creditCard.EziDebitCustomerID
    if (!creditCard.EziDebitCustomerID)
      this.YourSystemReference = creditCard.YourSystemReference
    this.CreditCardNumber = creditCard.CreditCardNumber
    this.CreditCardExpiryMonth = creditCard.CreditCardExpiryMonth
    this.CreditCardExpiryYear = moment(creditCard.CreditCardExpiryYear, 'YYYY').year().toString()
    this.NameOnCreditCard = creditCard.NameOnCreditCard
    this.Reactivate = creditCard.Reactivate ?? 'YES'
    this.Username = creditCard.Username ?? ''
  }
  // * EziDebitCustomerID
  @IsOptionalIfEmpty()
  @IsNumberString(undefined, {
    message: ErrorFactory.getErrorMessage(ErrorType.NotANumber, 'EziDebitCustomerID')
  })
  @MaxLength(50, {
    message: ErrorFactory.getErrorMessage(ErrorType.FieldTooLong, 'EziDebitCustomerID')
  })
  EziDebitCustomerID = '';

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

  // * NameOnCreditCard
  @IsNotEmpty({
    message: ErrorFactory.getErrorMessage(ErrorType.NotEmpty, 'NameOnCreditCard')
  })
  @MaxLength(100, {
    message: ErrorFactory.getErrorMessage(ErrorType.FieldTooLong, 'NameOnCreditCard')
  })
  NameOnCreditCard: string;

  // * Reactivate
  @IsNotEmpty({
    message: ErrorFactory.getErrorMessage(ErrorType.NotEmpty, 'Reactivate')
  })
  @IsIn(['YES', 'NO'], {
    message: ErrorFactory.getErrorMessage(ErrorType.NotInAllowedSet, 'Reactivate')
  })
  Reactivate: string

  // * YourSystemReference
  @MaxLength(50, {
    message: ErrorFactory.getErrorMessage(ErrorType.FieldTooLong, 'YourSystemReference')
  })
  YourSystemReference = '';

  // * Username
  @MaxLength(50, {
    message: ErrorFactory.getErrorMessage(ErrorType.FieldTooLong, 'Username')
  })
  Username = '';
}
