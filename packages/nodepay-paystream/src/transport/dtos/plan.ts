import {
  IsNotEmpty,
  IsNumber,
} from 'class-validator'

import {
  ErrorType,
  ErrorFactory,
} from '@atomixdesign/nodepay-core/validation/errors'

import { IPaystreamInternalPlan } from '../../types'

export class PlanDTO {
  constructor(plan: IPaystreamInternalPlan) {
    this.name = plan.name
    this.amount = plan.amount
    this.reference = plan.reference
    this.description = plan.description
  }

  // * name
  @IsNotEmpty({
    message: ErrorFactory.getErrorMessage(ErrorType.NotEmpty, 'name')
  })
  name: string;

  // * amount
  @IsNumber(undefined, {
    message: ErrorFactory.getErrorMessage(ErrorType.NotANumber, 'amount')
  })
  amount: number;

  // * reference
  @IsNotEmpty({
    message: ErrorFactory.getErrorMessage(ErrorType.NotEmpty, 'reference')
  })
  reference: string;

  // * description
  @IsNotEmpty({
    message: ErrorFactory.getErrorMessage(ErrorType.NotEmpty, 'description')
  })
  description: string;
}
