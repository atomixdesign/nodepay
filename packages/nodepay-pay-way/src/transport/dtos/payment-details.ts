import {
  IsNotEmpty,
  IsOptional,
} from 'class-validator'

import {
  ErrorType,
  ErrorFactory,
} from '@atomixdesign/nodepay-core/build/validation'
import { IPaywayInternalCustomerPaymentDetails } from '../../types'

/** @internal */
export class PaymentDetailsDTO {
  constructor(customer: IPaywayInternalCustomerPaymentDetails) {
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
