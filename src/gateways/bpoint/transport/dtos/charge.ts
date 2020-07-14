import { IBaseCharge, Currency, TransactionType, ActionType } from '../../types'
import { CreditCardDTO } from './credit-card'
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
  Errors,
} from '@atomixdesign/nodepay/validation/errors'

export class ChargeDTO {
  constructor(charge: IBaseCharge) {
    this.Action = ActionType.payment
    this.Amount = charge.Amount
    this.CardDetails = charge.CardDetails
    this.Currency = Currency.AUD
    this.Crn1 = charge.Crn1
    this.SubType = 'single'
    this.TestMode = charge.TestMode
    this.Type = charge.Type
    this.EmailAddress = charge.EmailAddress
    this.MerchantReference = charge.MerchantReference
  }
  // * Action
  Action: ActionType;

  // * Amount
  @IsNumber(undefined, {
    message: Errors.getErrorMessage(ErrorType.NotANumber, 'Amount')
  })
  Amount: number;

  // * CardDetails
  @ValidateNested()
  CardDetails: CreditCardDTO;

  // * Crn1
  @IsNotEmpty({
    message: Errors.getErrorMessage(ErrorType.NotEmpty, 'Crn1')
  })
  @MaxLength(50, {
    message: Errors.getErrorMessage(ErrorType.FieldTooLong, 'Crn1')
  })
  Crn1: string;

  // * Currency
  Currency: Currency;

  // * SubType
  SubType: 'single' | 'recurring';

  // * TestMode
  @IsOptional()
  @IsBoolean({
    message: Errors.getErrorMessage(ErrorType.NotABoolean, 'TestMode')
  })
  TestMode: boolean | undefined = false;

  // * Type
  Type: TransactionType | undefined;

  // * EmailAddress
  @IsOptional()
  @IsNotEmpty({
    message: Errors.getErrorMessage(ErrorType.NotEmpty, 'EmailAddress')
  })
  @IsEmail(undefined, {
    message: Errors.getErrorMessage(ErrorType.NotAnEmail, 'EmailAddress')
  })
  @MaxLength(250, {
    message: Errors.getErrorMessage(ErrorType.FieldTooLong, 'EmailAddress')
  })
  EmailAddress: string | undefined;

  // * MerchantReference
  @IsOptional()
  @IsNotEmpty({
    message: Errors.getErrorMessage(ErrorType.NotEmpty, 'MerchantReference')
  })
  @MaxLength(50, {
    message: Errors.getErrorMessage(ErrorType.FieldTooLong, 'MerchantReference')
  })
  MerchantReference: string | undefined;
}
