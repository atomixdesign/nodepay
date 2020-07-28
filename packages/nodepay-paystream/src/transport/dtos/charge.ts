import {
  IsNotEmpty,
  /* IsAlphanumeric,
  MaxLength, */
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
} from '@atomixdesign/nodepay-core/validation/errors'

import { IPaystreamInternalCharge } from '../../types'

export class ChargeDTO {
  constructor(charge: IPaystreamInternalCharge) {
    this.amount = charge.amountInCents / 100
    this.reference = charge.orderNumber
    this.customer_ip = charge.customerIp
    if (charge.cardToken !== undefined) {
      this.card_token = charge.cardToken
    } else {
      this.card_number = charge.creditCard?.cardNumber
      this.card_holder = charge.creditCard?.cardHolderName
      this.cvv = charge.creditCard?.CCV
      this.card_expiry = `${charge.creditCard?.expiryDateMonth}/${charge.creditCard?.expiryDateYear}`
    }
  }

  // * amount
  @IsNumber(undefined, {
    message: ErrorFactory.getErrorMessage(ErrorType.NotANumber, 'amount')
  })
  amount: number;

  // * reference
  @IsNotEmpty({
    message: ErrorFactory.getErrorMessage(ErrorType.NotEmpty, 'reference')
  })
  reference: string;

  // * customer_ip
  @IsIP('4', {
    message: ErrorFactory.getErrorMessage(ErrorType.IpInvalid, 'customer_ip')
  })
  customer_ip: string;

  // * card_token
  @IsOptional()
  @IsNotEmpty({
    message: ErrorFactory.getErrorMessage(ErrorType.NotEmpty, 'card_token')
  })
  card_token: string | undefined;

  // * card_number
  @IsOptional()
  @IsNotEmpty({
    message: ErrorFactory.getErrorMessage(ErrorType.NotEmpty, 'card_number')
  })
  @IsCreditCard({
    message: ErrorFactory.getErrorMessage(ErrorType.NotACreditCard, 'card_number')
  })
  card_number: string | undefined;

  // * card_holder
  @IsOptional()
  @IsNotEmpty({
    message: ErrorFactory.getErrorMessage(ErrorType.NotEmpty, 'card_holder')
  })
  card_holder: string | undefined;

  // * cvv
  @IsOptional()
  @Length(3, 4, {
    message: ErrorFactory.getErrorMessage(ErrorType.LengthOutOfBounds, 'cvv')
  })
  @IsNumberString(undefined, {
    message: ErrorFactory.getErrorMessage(ErrorType.NotANumber, 'cvv')
  })
  cvv: string | undefined;

  // * card_expiry
  @IsOptional()
  @Length(7, 7, {
    message: ErrorFactory.getErrorMessage(ErrorType.LengthOutOfBounds, 'card_expiry')
  })
  card_expiry: string | undefined;
}
