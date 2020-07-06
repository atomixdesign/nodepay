import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
} from 'class-validator'

import {
  ErrorType,
  Errors,
} from '../transport/errors'

import { PaymentFrequency } from '../payment-frequency'

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
    message: Errors.getErrorMessage(ErrorType.NumberRequired, 'regularPrincipalAmount')
  })
  regularPrincipalAmount: number;

  // * nextPrincipalAmount
  @IsOptional()
  nextPrincipalAmount?: number | undefined;

  // * numberOfPaymentsRemaining
  @IsOptional()
  numberOfPaymentsRemaining?: number | undefined;

  // * finalPrincipalAmount
  @IsOptional()
  finalPrincipalAmount?: number | undefined;
}
