import { IsNotEmpty, IsPostalCode } from 'class-validator'
import { ErrorFactory, ErrorType } from '@atomixdesign/nodepay-core/validation'
import { IPaystreamInternalAddress } from '../../types'

export class AddressDTO {
  constructor(address: IPaystreamInternalAddress) {
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
  address: string;

  // * city
  @IsNotEmpty({
    message: ErrorFactory.getErrorMessage(ErrorType.NotEmpty, 'city')
  })
  city: string;

  // * state
  @IsNotEmpty({
    message: ErrorFactory.getErrorMessage(ErrorType.NotEmpty, 'state')
  })
  state: string;

  // * postcode
  // TODO: render locale-aware. Default is 'Australia'.
  @IsPostalCode('AU', {
    message: ErrorFactory.getErrorMessage(ErrorType.NotAPostalCode, 'postcode')
  })
  postcode: string;

  // * country
  @IsNotEmpty({
    message: ErrorFactory.getErrorMessage(ErrorType.NotEmpty, 'country')
  })
  country: string;
}
