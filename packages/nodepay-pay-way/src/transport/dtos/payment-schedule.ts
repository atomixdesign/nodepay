import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
} from 'class-validator'

import {
  ErrorType,
  ErrorFactory,
} from '@atomixdesign/nodepay-core/build/validation'

import { PaywayPaymentFrequency, IPaywayInternalPaymentSchedule } from '../../types'

import debug from 'debug'
const log = debug('nodepay:pay-way')

/** @internal */
export class PaymentScheduleDTO {
  constructor(
    paymentSchedule: IPaywayInternalPaymentSchedule
  ) {
    log(`building ${this.constructor.name}`)
    log({ paymentSchedule })

    this.frequency = paymentSchedule.frequency
    this.nextPaymentDate = paymentSchedule.nextPaymentDate
    this.regularPrincipalAmount = paymentSchedule.regularPrincipalAmount
    this.nextPrincipalAmount = paymentSchedule.nextPrincipalAmount
    this.numberOfPaymentsRemaining = paymentSchedule.numberOfPaymentsRemaining
    this.finalPrincipalAmount = paymentSchedule.finalPrincipalAmount
  }

  // * frequency
  @IsNotEmpty({
    message: ErrorFactory.getErrorMessage(ErrorType.NotEmpty, 'frequency')
  })
  frequency: PaywayPaymentFrequency;

  // * nextPaymentDate
  @IsNotEmpty({
    message: ErrorFactory.getErrorMessage(ErrorType.NotEmpty, 'nextPaymentDate')
  })
  nextPaymentDate: string;

  // * regularPrincipalAmount
  @IsNumber(undefined, {
    message: ErrorFactory.getErrorMessage(ErrorType.NotANumber, 'regularPrincipalAmount')
  })
  regularPrincipalAmount: number;

  // * nextPrincipalAmount
  @IsOptional()
  @IsNumber(undefined, {
    message: ErrorFactory.getErrorMessage(ErrorType.NotANumber, 'nextPrincipalAmount')
  })
  nextPrincipalAmount?: number | undefined;

  // * numberOfPaymentsRemaining
  @IsOptional()
  @IsNumber(undefined, {
    message: ErrorFactory.getErrorMessage(ErrorType.NotANumber, 'numberOfPaymentsRemaining')
  })
  numberOfPaymentsRemaining?: number | undefined;

  // * finalPrincipalAmount
  @IsOptional()
  @IsNumber(undefined, {
    message: ErrorFactory.getErrorMessage(ErrorType.NotANumber, 'finalPrincipalAmount')
  })
  finalPrincipalAmount?: number | undefined;
}
