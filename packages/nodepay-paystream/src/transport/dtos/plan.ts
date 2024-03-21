import {
  IsNotEmpty,
  IsNumber,
} from 'class-validator'

import {
  ErrorType,
  ErrorFactory,
} from '@atomixdesign/nodepay-core/build/validation'

import { PaystreamPaymentPlan } from '../../types'

import debug from 'debug'

const log = debug('nodepay:paystream')

/** @internal */
export class PlanDTO {
  constructor(plan: PaystreamPaymentPlan) {
    log(`building ${this.constructor.name}`)
    log({ plan })
    this.name = plan.name
    this.amount = plan.amount
    this.reference = plan.reference
    this.description = plan.description
  }

  // * name
  @IsNotEmpty({
    message: ErrorFactory.getErrorMessage(ErrorType.NotEmpty, 'name'),
  })
  readonly name: string;

  // * amount
  @IsNumber(undefined, {
    message: ErrorFactory.getErrorMessage(ErrorType.NotANumber, 'amount'),
  })
  readonly amount: number;

  // * reference
  @IsNotEmpty({
    message: ErrorFactory.getErrorMessage(ErrorType.NotEmpty, 'reference'),
  })
  readonly reference: string;

  // * description
  @IsNotEmpty({
    message: ErrorFactory.getErrorMessage(ErrorType.NotEmpty, 'description'),
  })
  readonly description: string;
}
