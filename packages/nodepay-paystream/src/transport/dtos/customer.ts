import { IsNotEmpty, IsEmail, IsIP, ValidateNested } from 'class-validator'
import { ErrorFactory, ErrorType } from '@atomixdesign/nodepay-core/validation'

import { IPaystreamCustomer } from '../../types'
import { CreditCardDTO } from './credit-card'
import { AddressDTO } from './address'

export class CustomerDTO {
  constructor(customer: IPaystreamCustomer) {
    this.first_name = customer.firstName
    this.last_name = customer.lastName
    this.reference = customer.reference
    this.email = customer.emailAddress
    this.ipAddress = customer.ipAddress
    if (customer.creditCard !== undefined)
      this.card = new CreditCardDTO(customer.creditCard)
    if (customer.address !== undefined)
      this.address = new AddressDTO(customer.address)
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
