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
  ErrorFactory,
} from '@atomixdesign/nodepay-core/validation/errors'

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
    message: ErrorFactory.getErrorMessage(ErrorType.NotEmpty, 'customerNumber')
  })
  @IsAlphanumeric('en-US', {
    message: ErrorFactory.getErrorMessage(ErrorType.AlphanumRequired, 'customerNumber')
  })
  @MaxLength(20, {
    message: ErrorFactory.getErrorMessage(ErrorType.FieldTooLong, 'customerNumber')
  })
  customerNumber: string;

  // * transactionType
  transactionType: string;

  // * currency
  currency: string;

  // * principalAmount
  @IsNumber(undefined, {
    message: ErrorFactory.getErrorMessage(ErrorType.NotANumber, 'principalAmount')
  })
  principalAmount: number;

  // * orderNumber
  @IsOptional()
  @MaxLength(20, {
    message: ErrorFactory.getErrorMessage(ErrorType.FieldTooLong, 'orderNumber')
  })
  orderNumber: string | undefined;

  // * customerIpAddress
  @IsOptional()
  @IsIP('4', {
    message: ErrorFactory.getErrorMessage(ErrorType.IpInvalid, 'customerIpAddress')
  })
  customerIpAddress: string | undefined;

  // * merchantId
  @IsOptional()
  merchantId: string | undefined;

  // * bankAccountId
  @IsOptional()
  bankAccountId: string | undefined;
}