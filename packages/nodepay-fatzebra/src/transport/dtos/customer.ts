import {
  IsNotEmpty,
  IsEmail,
  IsIP,
  IsOptional,
  validateSync,
  // ValidateNested,
} from 'class-validator'
import { ErrorFactory, ErrorType } from '@atomixdesign/nodepay-core/build/validation'

import { FatzebraCustomer, FatzebraCreditCard, FatzebraAddress, FatzebraBankAccount } from '../../types'
import { CreditCardDTO } from './credit-card'
import { BankAccountDTO } from './bank-account'
import { AddressDTO } from './address'

import debug from 'debug'

const log = debug('nodepay:fatzebra')

/** @internal */
export class CustomerDTO {
  constructor(
    customer: FatzebraCustomer,
    creditCardOrToken?: FatzebraCreditCard | string,
    bankAccount?: FatzebraBankAccount,
    address?: FatzebraAddress,
  ) {
    log(`building ${this.constructor.name}`)
    log({ customer, creditCardOrToken, bankAccount, address })
    this.first_name = customer.firstName
    this.last_name = customer.lastName
    this.reference = customer.reference
    this.email = customer.emailAddress
    this.ipAddress = customer.ipAddress

    if (creditCardOrToken !== undefined) {
      if (typeof creditCardOrToken !== 'string') {
        this.card = new CreditCardDTO(creditCardOrToken)
        validateSync(this.card as CreditCardDTO)
      } else {
        this.card_token = creditCardOrToken
      }
    } else {
      if (bankAccount !== undefined) {
        this.bank_account = new BankAccountDTO(bankAccount)
        validateSync(this.bank_account as BankAccountDTO)
      }
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

  readonly card_token?: string;

  readonly bank_account?: BankAccountDTO;

  // @ValidateNested()
  @IsOptional()
  readonly address?: AddressDTO;
}
