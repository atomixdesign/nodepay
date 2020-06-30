import {
  IsNotEmpty,
  IsNumber,
  IsDate,
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
  @IsDate({
    message: Errors.getErrorMessage(ErrorType.NotADate, 'nextPaymentDate')
  })
  nextPaymentDate: string;

  // * nextPrincipalAmount
  nextPrincipalAmount?: number | undefined;

  // * regularPrincipalAmount
  @IsNumber(undefined, {
    message: Errors.getErrorMessage(ErrorType.NumberRequired, 'regularPrincipalAmount')
  })
  regularPrincipalAmount: number;

  // * numberOfPaymentsRemaining
  numberOfPaymentsRemaining?: number | undefined;

  // * finalPrincipalAmount
  finalPrincipalAmount?: number | undefined;
}
