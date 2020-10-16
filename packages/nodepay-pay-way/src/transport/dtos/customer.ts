import {
  IsNotEmpty,
  IsAlphanumeric,
  MaxLength,
  IsOptional,
  IsEmail,
  IsPhoneNumber,
  IsIn,
  IsNumberString,
  Length,
} from 'class-validator'

import {
  ErrorType,
  ErrorFactory,
} from '@atomixdesign/nodepay-core/build/validation'
import { PaywayCustomer } from '../../types'

import debug from 'debug'
const log = debug('nodepay:pay-way')

/** @internal */
export class CustomerDTO {
  constructor(customer: PaywayCustomer) {
    log(`building ${this.constructor.name}`)
    log({ customer })

    this.customerNumber = customer.customerId
    this.singleUseTokenId = customer.singleUseTokenId
    this.merchantId = customer.merchantId
    this.bankAccountId = customer.bankAccountId

    this.customerName = `${customer.firstName ?? ''} ${customer.lastName ?? ''}`
    this.emailAddress = customer.emailAddress
    this.sendEmailReceipts = customer.sendEmailReceipts ?? false
    this.phoneNumber = customer.phoneNumber
    this.street1 = customer.address1
    this.street2 = customer.address2
    this.cityName = customer.city
    this.state = customer.region
    this.postalCode = customer.postCode
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

  // * singleUseTokenId
  @IsNotEmpty({
    message: ErrorFactory.getErrorMessage(ErrorType.NotEmpty, 'singleUseTokenId')
  })
  singleUseTokenId: string;

  // * merchantId
  @IsOptional()
  merchantId: string | undefined;

  // * bankAccountId
  @IsOptional()
  bankAccountId: string | undefined;

  // * customerName
  @IsOptional()
  @MaxLength(60, {
    message: ErrorFactory.getErrorMessage(ErrorType.FieldTooLong, 'customerName')
  })
  customerName: string | undefined;

  // * emailAddress
  @IsOptional()
  @IsEmail(undefined, {
    message: ErrorFactory.getErrorMessage(ErrorType.NotAnEmail, 'emailAddress')
  })
  @MaxLength(128, {
    message: ErrorFactory.getErrorMessage(ErrorType.FieldTooLong, 'emailAddress')
  })
  emailAddress: string | undefined;

  // * sendEmailReceipts
  @IsOptional()
  sendEmailReceipts: boolean;

  // * phoneNumber
  @IsOptional()
  // eslint-disable-next-line unicorn/no-null
  @IsPhoneNumber(null, {
    message: ErrorFactory.getErrorMessage(ErrorType.NotAPhoneNumber, 'phoneNumber')
  })
  phoneNumber: string | undefined;

  // * street1
  @IsOptional()
  @MaxLength(128, {
    message: ErrorFactory.getErrorMessage(ErrorType.FieldTooLong, 'street1')
  })
  street1: string | undefined;

  // * street2
  @IsOptional()
  @MaxLength(128, {
    message: ErrorFactory.getErrorMessage(ErrorType.FieldTooLong, 'street2')
  })
  street2: string | undefined;

  // * cityName
  @IsOptional()
  @MaxLength(60, {
    message: ErrorFactory.getErrorMessage(ErrorType.FieldTooLong, 'cityName')
  })
  cityName: string | undefined;

  // * state
  @IsOptional()
  @IsIn([
    'ACT', 'NSW', 'NT', 'QLD', 'SA', 'TAS', 'VIC', 'WA',
  ], {
    message: ErrorFactory.getErrorMessage(ErrorType.NotInAllowedSet, 'state')
  })
  state: string | undefined;

  // * postalCode
  @IsOptional()
  @IsNumberString(undefined, {
    message: ErrorFactory.getErrorMessage(ErrorType.NotANumber, 'postalCode')
  })
  @Length(4, 4, {
    message: ErrorFactory.getErrorMessage(ErrorType.LengthOutOfBounds, 'postalCode')
  })
  postalCode: string | undefined;
}
