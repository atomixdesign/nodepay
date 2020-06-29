import {
  IsNotEmpty,
  IsNumber,
  IsDate,
} from 'class-validator'

import {
  ErrorType,
  Errors,
} from '../errors'

export enum PaymentFrequency {
  Weekly = 'weekly',
  Fortnightly = 'fortnightly',
  Monthly = 'monthly',
  Quarterly = 'quarterly',
  SixMonthly = 'six-monthly',
  Yearly = 'yearly'
}

export class PaymentScheduleDTO {
  constructor(
    {
      frequency,
      nextPaymentDate,
      nextPrincipalAmount,
      regularPrincipalAmount,
      numberOfPaymentsRemaining,
      finalPrincipalAmount
    } :
    {
      frequency: PaymentFrequency
      nextPaymentDate: string
      nextPrincipalAmount?: number
      regularPrincipalAmount: number
      numberOfPaymentsRemaining?: number
      finalPrincipalAmount?: number
    }
  ) {
    this.frequency = frequency
    this.nextPaymentDate = nextPaymentDate
    this.nextPrincipalAmount = nextPrincipalAmount
    this.regularPrincipalAmount = regularPrincipalAmount
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
