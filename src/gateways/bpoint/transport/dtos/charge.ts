import { IBaseCharge, Currency, TransactionType, ActionType } from '../../types'
import { CreditCardDTO } from './credit-card'
import {
  IsNotEmpty,
  MaxLength,
  IsNumber,
  IsOptional,
  IsBoolean,
  ValidateNested,
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
  TestMode = false;

  // * Type
  Type: TransactionType;
}
