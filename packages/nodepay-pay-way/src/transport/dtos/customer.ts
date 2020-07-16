import {
  IsNotEmpty,
  IsAlphanumeric,
  MaxLength,
  IsOptional,
} from 'class-validator'

import {
  ErrorType,
  ErrorFactory,
} from '@atomixdesign/nodepay-core/validation/errors'

export class CustomerDTO {
  constructor(
    {
      customerNumber,
      singleUseTokenId,
      merchantId,
      bankAccountId,
    }:
      {
        customerNumber: string
        singleUseTokenId: string
        merchantId?: string
        bankAccountId?: string
      }
  ) {
    this.customerNumber = customerNumber
    this.singleUseTokenId = singleUseTokenId
    this.merchantId = merchantId
    this.bankAccountId = bankAccountId
  }

  // * customerNumber
  @IsNotEmpty({
    message: ErrorFactory.getErrorMessage(ErrorType.NotEmpty, 'customerNumber')
  })
  @IsAlphanumeric('en-US', {
    message: ErrorFactory.getErrorMessage(ErrorType.AlphanumRequired, 'customerNumber')
  })
  @MaxLength(20, {
    message: ErrorFactory.getErrorMessage(ErrorType.FieldTooLong, 'customerNumber')
  })
  customerNumber: string;

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
