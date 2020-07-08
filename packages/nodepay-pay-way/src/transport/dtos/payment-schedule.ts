import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
} from 'class-validator'

import {
  ErrorType,
  Errors,
} from '@atomixdesign/nodepay/validation/errors'

import { PaymentFrequency } from '../../types/payment-frequency'

export class PaymentScheduleDTO {
  constructor(
    {
      frequency,
      nextPaymentDate,
      regularPrincipalAmount,
      nextPrincipalAmount,
      numberOfPaymentsRemaining,
      finalPrincipalAmount
    } :
    {
      frequency: PaymentFrequency
      nextPaymentDate: string
      regularPrincipalAmount: number
      nextPrincipalAmount?: number
      numberOfPaymentsRemaining?: number
      finalPrincipalAmount?: number
    }
  ) {
    this.frequency = frequency
    this.nextPaymentDate = nextPaymentDate
    this.regularPrincipalAmount = regularPrincipalAmount
    this.nextPrincipalAmount = nextPrincipalAmount
    this.numberOfPaymentsRemaining = numberOfPaymentsRemaining
    this.finalPrincipalAmount = finalPrincipalAmount
  }

  // * frequency
  @IsNotEmpty({
    message: Errors.getErrorMessage(ErrorType.NotEmpty, 'frequency')
  })
  frequency: PaymentFrequency;

  // * nextPaymentDate
  @IsNotEmpty({
    message: Errors.getErrorMessage(ErrorType.NotEmpty, 'nextPaymentDate')
  })
  nextPaymentDate: string;

  // * regularPrincipalAmount
  @IsNumber(undefined, {
    message: Errors.getErrorMessage(ErrorType.NotANumber, 'regularPrincipalAmount')
  })
  regularPrincipalAmount: number;

  // * nextPrincipalAmount
  @IsOptional()
  @IsNumber(undefined, {
    message: Errors.getErrorMessage(ErrorType.NotANumber, 'nextPrincipalAmount')
  })
  nextPrincipalAmount?: number | undefined;

  // * numberOfPaymentsRemaining
  @IsOptional()
  @IsNumber(undefined, {
    message: Errors.getErrorMessage(ErrorType.NotANumber, 'numberOfPaymentsRemaining')
  })
  numberOfPaymentsRemaining?: number | undefined;

  // * finalPrincipalAmount
  @IsOptional()
  @IsNumber(undefined, {
    message: Errors.getErrorMessage(ErrorType.NotANumber, 'finalPrincipalAmount')
  })
  finalPrincipalAmount?: number | undefined;
}
