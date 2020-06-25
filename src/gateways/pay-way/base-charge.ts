import {
  IsNotEmpty,
  IsAlphanumeric,
  MaxLength,
  IsNumber,
  IsOptional,
  IsIP,
} from 'class-validator'

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
    this.currency = 'aud' // TODO: only AUD supported with PayWay. Consider enum.
    this.orderNumber = orderNumber
    this.customerIpAddress = customerIpAddress
  }

  @IsNotEmpty({
    message: 'customerNumber is empty. Value is required.'
  })
  @IsAlphanumeric('en-US', {
    message: 'customerNumber contains illegal characters. Only letters and numbers allowed, received $value.'
  })
  @MaxLength(20, {
    message: 'customerNumber is too long. Maximal length is $constraint1 characters, but actual is $value.'
  })
  customerNumber: string;

  transactionType: string;

  @IsNumber(undefined, {
    message: 'principalAmount is not a number. Number required, received $value.'
  })
  principalAmount: number;

  currency: string;

  @IsOptional()
  @MaxLength(20, {
    message: 'orderNumber is too long. Maximal length is $constraint1 characters, but actual is $value.'
  })
  orderNumber: string | undefined;

  @IsIP('4', {
    message: 'customerIpAddress is invalid. Received $value.'
  })
  customerIpAddress: string | undefined;
}
