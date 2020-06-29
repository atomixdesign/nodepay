import {
  IsNotEmpty,
  IsAlphanumeric,
  MaxLength,
} from 'class-validator'

import {
  ErrorType,
  Errors,
} from '../errors'

export class CustomerDTO {
  constructor(
    {
      customerNumber,
      singleUseTokenId,
      merchantId,
    }:
      {
        customerNumber: string
        singleUseTokenId: string
        merchantId: string
      }
  ) {
    this.customerNumber = customerNumber
    this.singleUseTokenId = singleUseTokenId
    this.merchantId = merchantId
  }

  // * customerNumber
  @IsNotEmpty({
    message: Errors.getErrorMessage(ErrorType.NotEmpty, 'customerNumber')
  })
  @IsAlphanumeric('en-US', {
    message: Errors.getErrorMessage(ErrorType.AlphanumRequired, 'customerNumber')
  })
  @MaxLength(20, {
    message: Errors.getErrorMessage(ErrorType.FieldTooLong, 'customerNumber')
  })
  customerNumber: string;

  // * singleUseTokenId
  @IsNotEmpty({
    message: Errors.getErrorMessage(ErrorType.NotEmpty, 'singleUseTokenId')
  })
  singleUseTokenId: string;

  // * merchantId
  @IsNotEmpty({
    message: Errors.getErrorMessage(ErrorType.NotEmpty, 'merchantId')
  })
  merchantId: string;
}
