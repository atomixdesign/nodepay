import {
  IsNotEmpty,
  MaxLength,
  IsNumber,
  IsOptional,
  IsBoolean,
  ValidateNested,
  IsEmail,
} from 'class-validator'

import {
  ErrorType,
  ErrorFactory,
} from '@atomixdesign/nodepay-core/build/validation'
import {
  IBPOINTInternalCharge,
  BPOINTCurrency,
  BPOINTTransactionType,
  BPOINTActionType,
  BPOINTCreditCard,
} from '../../types'
import { CreditCardDTO } from './credit-card'

import debug from 'debug'

const log = debug('nodepay:bpoint')

/** @internal */
export class ChargeDTO {
  constructor(
    charge: IBPOINTInternalCharge,
    creditCard: BPOINTCreditCard,
  ) {
    log(`building ${this.constructor.name}`)
    log({ charge })
    this.Action = BPOINTActionType.payment
    this.Amount = charge.Amount
    this.CardDetails = new CreditCardDTO(creditCard)
    this.Currency = BPOINTCurrency.AUD
    this.Crn1 = charge.Crn1
    this.SubType = 'single'
    this.TestMode = charge.TestMode
    this.Type = charge.Type
    this.EmailAddress = charge.EmailAddress
    this.MerchantReference = charge.MerchantReference
  }
  // * Action
  Action: BPOINTActionType;

  // * Amount
  @IsNumber(undefined, {
    message: ErrorFactory.getErrorMessage(ErrorType.NotANumber, 'Amount'),
  })
  Amount: number;

  // * CardDetails
  @ValidateNested()
  CardDetails: CreditCardDTO;

  // * Crn1
  @IsNotEmpty({
    message: ErrorFactory.getErrorMessage(ErrorType.NotEmpty, 'Crn1'),
  })
  @MaxLength(50, {
    message: ErrorFactory.getErrorMessage(ErrorType.FieldTooLong, 'Crn1'),
  })
  Crn1: string;

  // * Currency
  Currency: BPOINTCurrency;

  // * SubType
  SubType: 'single' | 'recurring';

  // * TestMode
  @IsOptional()
  @IsBoolean({
    message: ErrorFactory.getErrorMessage(ErrorType.NotABoolean, 'TestMode'),
  })
  TestMode: boolean | undefined = false;

  // * Type
  Type: BPOINTTransactionType | undefined;

  // * EmailAddress
  @IsOptional()
  @IsNotEmpty({
    message: ErrorFactory.getErrorMessage(ErrorType.NotEmpty, 'EmailAddress'),
  })
  @IsEmail(undefined, {
    message: ErrorFactory.getErrorMessage(ErrorType.NotAnEmail, 'EmailAddress'),
  })
  @MaxLength(250, {
    message: ErrorFactory.getErrorMessage(ErrorType.FieldTooLong, 'EmailAddress'),
  })
  EmailAddress: string | undefined;

  // * MerchantReference
  @IsOptional()
  @IsNotEmpty({
    message: ErrorFactory.getErrorMessage(ErrorType.NotEmpty, 'MerchantReference'),
  })
  @MaxLength(50, {
    message: ErrorFactory.getErrorMessage(ErrorType.FieldTooLong, 'MerchantReference'),
  })
  MerchantReference: string | undefined;
}
