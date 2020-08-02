import { IsNotEmpty, IsEmail, IsIP, ValidateNested } from 'class-validator'
import { ErrorFactory, ErrorType } from '@atomixdesign/nodepay-core/validation'

import { PaystreamCustomer, PaystreamCreditCard, PaystreamAddress } from '../../types'
import { CreditCardDTO } from './credit-card'
import { AddressDTO } from './address'

/** @internal */
export class CustomerDTO {
  constructor(
    customer: PaystreamCustomer,
    creditCard?: PaystreamCreditCard,
    address?: PaystreamAddress,
  ) {
    this.first_name = customer.firstName
    this.last_name = customer.lastName
    this.reference = customer.reference
    this.email = customer.emailAddress
    this.ipAddress = customer.ipAddress
    if (creditCard !== undefined)
      this.card = new CreditCardDTO(creditCard)
    if (address !== undefined)
      this.address = new AddressDTO(address)
  }

  // * first_name
  @IsNotEmpty({
    message: ErrorFactory.getErrorMessage(ErrorType.NotEmpty, 'first_name')
  })
  readonly first_name: string;

  // * last_name
  @IsNotEmpty({
    message: ErrorFactory.getErrorMessage(ErrorType.NotEmpty, 'last_name')
  })
  readonly last_name: string;

  // * reference
  @IsNotEmpty({
    message: ErrorFactory.getErrorMessage(ErrorType.NotEmpty, 'reference')
  })
  readonly reference: string;

  // * email
  @IsEmail(undefined, {
    message: ErrorFactory.getErrorMessage(ErrorType.NotAnEmail, 'email')
  })
  readonly email: string;

  // * ipAddress
  @IsIP('4',
    {
      message: ErrorFactory.getErrorMessage(ErrorType.NotAValidIP, 'ipAddress')
    })
  readonly ipAddress: string;

  @ValidateNested()
  readonly card: CreditCardDTO | undefined;

  @ValidateNested()
  readonly address: AddressDTO | undefined;
}