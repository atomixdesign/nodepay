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
} from './errors'

export class BaseCharge {
  constructor(
    customerNumber: string,
    principalAmount: number,
    orderNumber?: string,
    customerIpAddress?: string,
  ) {
    this.customerNumber = customerNumber
    this.transactionType = 'payment'
    this.principalAmount = principalAmount
    this.orderNumber = orderNumber
    this.customerIpAddress = customerIpAddress
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
  @IsIP('4', {
    message: Errors.getErrorMessage(ErrorType.IpInvalid, 'customerIpAddress')
  })
  customerIpAddress: string | undefined;
}
