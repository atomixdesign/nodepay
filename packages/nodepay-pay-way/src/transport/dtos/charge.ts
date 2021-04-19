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
} from '@atomixdesign/nodepay-core/build/validation'
import { IPaywayInternalCharge } from '../../types'

import debug from 'debug'
const log = debug('nodepay:pay-way')

/** @internal */
export class ChargeDTO {
  constructor(charge: IPaywayInternalCharge) {
    log(`building ${this.constructor.name}`)
    log({ charge })
    this.customerNumber = charge.customerId
    this.transactionType = 'payment'
    this.principalAmount = charge.principalAmount
    this.currency = 'aud'
    this.orderNumber = charge.orderNumber
    this.customerIpAddress = charge.customerIpAddress
    this.merchantId = charge.merchantId
    this.bankAccountId = charge.bankAccountId
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
    message: ErrorFactory.getErrorMessage(ErrorType.NotAValidIP, 'customerIpAddress')
  })
  customerIpAddress: string | undefined;

  // * merchantId
  @IsOptional()
  merchantId: string | undefined;

  // * bankAccountId
  @IsOptional()
  bankAccountId: string | undefined;
}
