import { IsNotEmpty, IsOptional } from 'class-validator'
import { ErrorFactory, ErrorType } from '@atomixdesign/nodepay-core/build/validation'
import { FatzebraPaymentFrequency, FatzebraPaymentPlan } from '../../types'

import debug from 'debug'

const log = debug('nodepay:fatzebra')


/** @internal */
export class PaymentPlanDTO {
  constructor(paymentPlan: FatzebraPaymentPlan) {
    log(`building ${this.constructor.name}`)
    log({ paymentPlan })
    this.customer = paymentPlan.customerId
    this.amount = paymentPlan.amountInCents
    this.setup_fee = paymentPlan.setupFee ?? 0
    this.frequency = paymentPlan.frequency
    this.payment_method = paymentPlan.paymentMethod ?? 'Credit Card'
    this.anniversary = paymentPlan.anniversary ?? 1
    this.start_date = paymentPlan.startDate
    this.end_date = paymentPlan.endDate
    this.reference = paymentPlan.reference
    this.description = paymentPlan.description
    this.currency = paymentPlan.currency
    this.total_count = paymentPlan.totalCount
    this.total_amount = paymentPlan.totalAmount
    this.failed_payment_fee = paymentPlan.failedPaymentFee
    this.retry_interval = paymentPlan.retryInterval
  }

  // * customer
  @IsNotEmpty({
    message: ErrorFactory.getErrorMessage(ErrorType.NotEmpty, 'customer'),
  })
  customer: string;

  @IsNotEmpty({
    message: ErrorFactory.getErrorMessage(ErrorType.NotEmpty, 'amount'),
  })
  amount: number;

  setup_fee = 0;

  // * frequency
  @IsNotEmpty({
    message: ErrorFactory.getErrorMessage(ErrorType.NotEmpty, 'frequency'),
  })
  frequency: FatzebraPaymentFrequency;

  @IsNotEmpty({
    message: ErrorFactory.getErrorMessage(ErrorType.NotEmpty, 'payment_method'),
  })
  payment_method = 'Credit Card';

  anniversary = 1;

  // * start_date
  @IsNotEmpty({
    message: ErrorFactory.getErrorMessage(ErrorType.NotEmpty, 'start_date'),
  })
  start_date: string;

  @IsOptional()
  @IsNotEmpty({
    message: ErrorFactory.getErrorMessage(ErrorType.NotEmpty, 'end_date'),
  })
  end_date?: string;

  @IsOptional()
  @IsNotEmpty({
    message: ErrorFactory.getErrorMessage(ErrorType.NotEmpty, 'reference'),
  })
  reference?: string;

  @IsOptional()
  @IsNotEmpty({
    message: ErrorFactory.getErrorMessage(ErrorType.NotEmpty, 'description'),
  })
  description?: string;

  @IsOptional()
  @IsNotEmpty({
    message: ErrorFactory.getErrorMessage(ErrorType.NotEmpty, 'currency'),
  })
  currency?: string;

  @IsOptional()
  @IsNotEmpty({
    message: ErrorFactory.getErrorMessage(ErrorType.NotEmpty, 'total_count'),
  })
  total_count?: number;

  @IsOptional()
  @IsNotEmpty({
    message: ErrorFactory.getErrorMessage(ErrorType.NotEmpty, 'total_amount'),
  })
  total_amount?: number;

  @IsOptional()
  @IsNotEmpty({
    message: ErrorFactory.getErrorMessage(ErrorType.NotEmpty, 'failed_payment_fee'),
  })
  failed_payment_fee?: number;

  @IsOptional()
  @IsNotEmpty({
    message: ErrorFactory.getErrorMessage(ErrorType.NotEmpty, 'retry_interval'),
  })
  retry_interval?: number;
}
