import {
  IsNotEmpty,
  IsOptional,
} from 'class-validator'

import {
  ErrorType,
  ErrorFactory,
} from '@atomixdesign/nodepay-core/validation'
import { IPaywayInternalCustomerPaymentDetails } from '../../types'

import debug from 'debug'
const log = debug('nodepay:pay-way')

/** @internal */
export class PaymentDetailsDTO {
  constructor(customer: IPaywayInternalCustomerPaymentDetails) {
    log(`building ${this.constructor.name}`)
    log({ customer })

    this.singleUseTokenId = customer.singleUseTokenId
    this.merchantId = customer.merchantId
    this.bankAccountId = customer.bankAccountId
  }

  // * singleUseTokenId
  @IsNotEmpty({
    message: ErrorFactory.getErrorMessage(ErrorType.NotEmpty, 'singleUseTokenId')
  })
  singleUseTokenId: string;

  // * merchantId
  @IsOptional()
  merchantId: string | undefined;

  // * bankAccountId
  @IsOptional()
  bankAccountId: string | undefined;
}
