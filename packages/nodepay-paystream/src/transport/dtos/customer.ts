import {
  IsNotEmpty,
  IsEmail,
  IsIP,
  IsOptional,
  validateSync,
  // ValidateNested,
} from 'class-validator'
import { ErrorFactory, ErrorType } from '@atomixdesign/nodepay-core/build/validation'

import { PaystreamCustomer, PaystreamCreditCard, PaystreamAddress } from '../../types'
import { CreditCardDTO } from './credit-card'
import { AddressDTO } from './address'

import debug from 'debug'

const log = debug('nodepay:paystream')

/** @internal */
export class CustomerDTO {
  constructor(
    customer: PaystreamCustomer,
    creditCard?: PaystreamCreditCard,
    address?: PaystreamAddress,
  ) {
    log(`building ${this.constructor.name}`)
    log({ customer })
    this.first_name = customer.firstName
    this.last_name = customer.lastName
    this.reference = customer.reference
    this.email = customer.emailAddress
    this.ipAddress = customer.ipAddress

    if (creditCard !== undefined) {
      this.card = new CreditCardDTO(creditCard)
      validateSync(this.card as CreditCardDTO)
    }

    if (address !== undefined &&! Object.values(address).every(entry => entry === undefined)) {
      this.address = new AddressDTO(address)
      validateSync(this.address)
    }
  }

  // * first_name
  @IsNotEmpty({
    message: ErrorFactory.getErrorMessage(ErrorType.NotEmpty, 'first_name'),
  })
  readonly first_name: string;

  // * last_name
  @IsNotEmpty({
    message: ErrorFactory.getErrorMessage(ErrorType.NotEmpty, 'last_name'),
  })
  readonly last_name: string;

  // * reference
  @IsNotEmpty({
    message: ErrorFactory.getErrorMessage(ErrorType.NotEmpty, 'reference'),
  })
  readonly reference: string;

  // * email
  @IsEmail(undefined, {
    message: ErrorFactory.getErrorMessage(ErrorType.NotAnEmail, 'email'),
  })
  readonly email: string;

  // * ipAddress
  @IsOptional()
  @IsIP('4',
    {
      message: ErrorFactory.getErrorMessage(ErrorType.NotAValidIP, 'ipAddress'),
    })
  readonly ipAddress?: string;

  // TODO: troubleshoot @ValidateNested
  // @ValidateNested()
  readonly card?: CreditCardDTO;

  // @ValidateNested()
  @IsOptional()
  readonly address?: AddressDTO;
}
