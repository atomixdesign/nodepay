import { IsNotEmpty, IsPostalCode } from 'class-validator'
import { ErrorFactory, ErrorType } from '@atomixdesign/nodepay-core/build/validation'
import { PaystreamAddress } from '../../types'

/** @internal */
export class AddressDTO {
  constructor(address: PaystreamAddress) {
    this.address = address.address
    this.city = address.city
    this.state = address.state
    this.postcode = address.postcode
    this.country = address.country
  }

  // * address
  @IsNotEmpty({
    message: ErrorFactory.getErrorMessage(ErrorType.NotEmpty, 'address')
  })
  readonly address: string;

  // * city
  @IsNotEmpty({
    message: ErrorFactory.getErrorMessage(ErrorType.NotEmpty, 'city')
  })
  readonly city: string;

  // * state
  @IsNotEmpty({
    message: ErrorFactory.getErrorMessage(ErrorType.NotEmpty, 'state')
  })
  readonly state: string;

  // * postcode
  // TODO: render locale-aware. Default is 'Australia'.
  @IsPostalCode('AU', {
    message: ErrorFactory.getErrorMessage(ErrorType.NotAPostalCode, 'postcode')
  })
  readonly postcode: string;

  // * country
  @IsNotEmpty({
    message: ErrorFactory.getErrorMessage(ErrorType.NotEmpty, 'country')
  })
  readonly country: string;
}
