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
} from '@atomixdesign/nodepay-core/validation/errors'
import {
  IBPOINTBaseCharge,
  BPOINTCurrency,
  BPOINTTransactionType,
  BPOINTActionType,
} from '../../types'
import { CreditCardDTO } from './credit-card'


export class ChargeDTO {
  constructor(charge: IBPOINTBaseCharge) {
    this.Action = BPOINTActionType.payment
    this.Amount = charge.Amount
    this.CardDetails = charge.CardDetails
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
    message: ErrorFactory.getErrorMessage(ErrorType.NotANumber, 'Amount')
  })
  Amount: number;

  // * CardDetails
  @ValidateNested()
  CardDetails: CreditCardDTO;

  // * Crn1
  @IsNotEmpty({
    message: ErrorFactory.getErrorMessage(ErrorType.NotEmpty, 'Crn1')
  })
  @MaxLength(50, {
    message: ErrorFactory.getErrorMessage(ErrorType.FieldTooLong, 'Crn1')
  })
  Crn1: string;

  // * Currency
  Currency: BPOINTCurrency;

  // * SubType
  SubType: 'single' | 'recurring';

  // * TestMode
  @IsOptional()
  @IsBoolean({
    message: ErrorFactory.getErrorMessage(ErrorType.NotABoolean, 'TestMode')
  })
  TestMode: boolean | undefined = false;

  // * Type
  Type: BPOINTTransactionType | undefined;

  // * EmailAddress
  @IsOptional()
  @IsNotEmpty({
    message: ErrorFactory.getErrorMessage(ErrorType.NotEmpty, 'EmailAddress')
  })
  @IsEmail(undefined, {
    message: ErrorFactory.getErrorMessage(ErrorType.NotAnEmail, 'EmailAddress')
  })
  @MaxLength(250, {
    message: ErrorFactory.getErrorMessage(ErrorType.FieldTooLong, 'EmailAddress')
  })
  EmailAddress: string | undefined;

  // * MerchantReference
  @IsOptional()
  @IsNotEmpty({
    message: ErrorFactory.getErrorMessage(ErrorType.NotEmpty, 'MerchantReference')
  })
  @MaxLength(50, {
    message: ErrorFactory.getErrorMessage(ErrorType.FieldTooLong, 'MerchantReference')
  })
  MerchantReference: string | undefined;
}
