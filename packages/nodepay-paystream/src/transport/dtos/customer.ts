import { IsNotEmpty, IsEmail, IsIP, ValidateNested } from 'class-validator'
import { ErrorFactory, ErrorType } from '@atomixdesign/nodepay-core/validation'

import { IPaystreamInternalCustomer } from '../../types'
import { CreditCardDTO } from './credit-card'
import { AddressDTO } from './address'

export class CustomerDTO {
  constructor(customer: IPaystreamInternalCustomer) {
    this.first_name = customer.firstName
    this.last_name = customer.lastName
    this.reference = customer.reference
    this.email = customer.email
    this.ipAddress = customer.ipAddress
    this.card = new CreditCardDTO(customer.creditCard)
    this.address = new AddressDTO(customer.address)
  }

  // * first_name
  @IsNotEmpty({
    message: ErrorFactory.getErrorMessage(ErrorType.NotEmpty, 'first_name')
  })
  first_name: string;

  // * last_name
  @IsNotEmpty({
    message: ErrorFactory.getErrorMessage(ErrorType.NotEmpty, 'last_name')
  })
  last_name: string;

  // * reference
  @IsNotEmpty({
    message: ErrorFactory.getErrorMessage(ErrorType.NotEmpty, 'reference')
  })
  reference: string;

  // * email
  @IsEmail(undefined, {
    message: ErrorFactory.getErrorMessage(ErrorType.NotAnEmail, 'email')
  })
  email: string;

  // * ipAddress
  @IsIP('4',
    {
      message: ErrorFactory.getErrorMessage(ErrorType.NotAValidIP, 'ipAddress')
    })
  ipAddress: string;

  @ValidateNested()
  card: CreditCardDTO;

  @ValidateNested()
  address: AddressDTO;
}
