import {
  IsNotEmpty,
  IsAlphanumeric,
  MaxLength,
  IsNumber,
  IsOptional,
  IsIP,
} from 'class-validator'

import {
  ErrorType,
  Errors,
} from '@atomixdesign/nodepay/validation/errors'

export class ChargeDTO {
  constructor(
    {
      customerNumber,
      principalAmount,
      orderNumber,
      customerIpAddress,
      merchantId,
      bankAccountId
    } :
    {
      customerNumber: string
      principalAmount: number
      orderNumber?: string
      customerIpAddress?: string
      merchantId?: string
      bankAccountId?: string
    }
  ) {
    this.customerNumber = customerNumber
    this.transactionType = 'payment'
    this.principalAmount = principalAmount
    this.currency = 'aud'
    this.orderNumber = orderNumber
    this.customerIpAddress = customerIpAddress
    this.merchantId = merchantId
    this.bankAccountId = bankAccountId
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

  // * transactionType
  transactionType: string;

  // * currency
  currency: string;

  // * principalAmount
  @IsNumber(undefined, {
    message: Errors.getErrorMessage(ErrorType.NumberRequired, 'principalAmount')
  })
  principalAmount: number;

  // * orderNumber
  @IsOptional()
  @MaxLength(20, {
    message: Errors.getErrorMessage(ErrorType.FieldTooLong, 'orderNumber')
  })
  orderNumber: string | undefined;

  // * customerIpAddress
  @IsOptional()
  @IsIP('4', {
    message: Errors.getErrorMessage(ErrorType.IpInvalid, 'customerIpAddress')
  })
  customerIpAddress: string | undefined;

  // * merchantId
  @IsOptional()
  merchantId: string | undefined;

  // * bankAccountId
  @IsOptional()
  bankAccountId: string | undefined;
}
