import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsIP,
  IsCreditCard,
  Length,
  IsNumberString,
} from 'class-validator'

import {
  ErrorType,
  ErrorFactory,
} from '@atomixdesign/nodepay-core/build/validation'

import { FatzebraCharge, FatzebraCreditCard } from '../../types'

import debug from 'debug'

const log = debug('nodepay:fatzebra')

/** @internal */
export class ChargeDTO {
  constructor(
    charge: FatzebraCharge,
    creditCard?: FatzebraCreditCard,
  ) {
    log(`building ${this.constructor.name}`)
    log({ charge })
    this.amount = charge.amountInCents
    this.reference = charge.orderNumber
    this.customer_ip = charge.customerIp

    if (charge.cardToken !== undefined) {
      this.card_token = charge.cardToken
    } else {
      this.card_number = creditCard?.cardNumber
      this.card_holder = creditCard?.cardHolderName
      this.cvv = creditCard?.CCV
      this.card_expiry = `${creditCard?.expiryDateMonth}/${creditCard?.expiryDateYear}`
    }

    this.capture = charge.capture
  }

  // * amount
  @IsNumber(undefined, {
    message: ErrorFactory.getErrorMessage(ErrorType.NotANumber, 'amount'),
  })
  readonly amount: number;

  // * reference
  @IsNotEmpty({
    message: ErrorFactory.getErrorMessage(ErrorType.NotEmpty, 'reference'),
  })
  readonly reference: string;

  // * customer_ip
  @IsIP(undefined, {
    message: ErrorFactory.getErrorMessage(ErrorType.NotAValidIP, 'customer_ip'),
  })
  readonly customer_ip: string;

  // * card_token
  @IsOptional()
  @IsNotEmpty({
    message: ErrorFactory.getErrorMessage(ErrorType.NotEmpty, 'card_token'),
  })
  readonly card_token: string | undefined;

  // * card_number
  @IsOptional()
  @IsNotEmpty({
    message: ErrorFactory.getErrorMessage(ErrorType.NotEmpty, 'card_number'),
  })
  @IsCreditCard({
    message: ErrorFactory.getErrorMessage(ErrorType.NotACreditCard, 'card_number'),
  })
  readonly card_number: string | undefined;

  // * card_holder
  @IsOptional()
  @IsNotEmpty({
    message: ErrorFactory.getErrorMessage(ErrorType.NotEmpty, 'card_holder'),
  })
  readonly card_holder: string | undefined;

  // * cvv
  @IsOptional()
  @Length(3, 4, {
    message: ErrorFactory.getErrorMessage(ErrorType.LengthOutOfBounds, 'cvv'),
  })
  @IsNumberString(undefined, {
    message: ErrorFactory.getErrorMessage(ErrorType.NotANumber, 'cvv'),
  })
  readonly cvv: string | undefined;

  // * card_expiry
  @IsOptional()
  @Length(7, 7, {
    message: ErrorFactory.getErrorMessage(ErrorType.LengthOutOfBounds, 'card_expiry'),
  })
  readonly card_expiry: string | undefined;

  readonly capture: boolean
}
