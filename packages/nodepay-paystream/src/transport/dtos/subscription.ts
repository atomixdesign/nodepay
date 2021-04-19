import { IsNotEmpty } from 'class-validator'
import { ErrorFactory, ErrorType } from '@atomixdesign/nodepay-core/validation'
import { PaystreamPaymentFrequency, PaystreamSubscription } from '../../types'

import debug from 'debug'
const log = debug('nodepay:paystream')

/** @internal */
export class SubscriptionDTO {
  constructor(subscription: PaystreamSubscription) {
    log(`building ${this.constructor.name}`)
    log({ subscription })
    this.customer = subscription.customerId
    this.plan = subscription.plan
    this.frequency = subscription.frequency
    this.start_date = subscription.startDate
    this.reference = subscription.reference
    this.is_active = Boolean(subscription.isActive)
  }

  // * customer
  @IsNotEmpty({
    message: ErrorFactory.getErrorMessage(ErrorType.NotEmpty, 'customer')
  })
  customer: string;

  // * plan
  @IsNotEmpty({
    message: ErrorFactory.getErrorMessage(ErrorType.NotEmpty, 'plan')
  })
  plan: string;

  // * frequency
  @IsNotEmpty({
    message: ErrorFactory.getErrorMessage(ErrorType.NotEmpty, 'frequency')
  })
  frequency: PaystreamPaymentFrequency;

  // * start_date
  @IsNotEmpty({
    message: ErrorFactory.getErrorMessage(ErrorType.NotEmpty, 'start_date')
  })
  start_date: string;

  // * reference
  @IsNotEmpty({
    message: ErrorFactory.getErrorMessage(ErrorType.NotEmpty, 'reference')
  })
  reference: string;

  // * is_active
  is_active: boolean;
}
