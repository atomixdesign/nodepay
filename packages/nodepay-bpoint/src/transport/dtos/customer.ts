import {
  ValidateNested, IsOptional, IsNotEmpty, MaxLength, IsEmail,
} from 'class-validator'

import {
  ErrorType,
  ErrorFactory,
} from '@atomixdesign/nodepay-core/validation/errors'
import { IBPOINTCustomer } from '../../types'
import { CreditCardDTO } from './credit-card'
import { BankAccountDTO } from './bank-account'

export class CustomerDTO {
  constructor(customer: IBPOINTCustomer) {
    this.CardDetails = customer.CardDetails
    this.BankAccountDetails = customer.BankAccountDetails
    this.Crn1 = customer.Crn1
    this.EmailAddress = customer.EmailAddress
    /*

Crn1	string	(MaxLen = 50)
Crn2	string	(MaxLen = 50) Optional
Crn3	string	(MaxLen = 50) Optional
EmailAddress	string	Customer's email address. (MaxLen = 250) Optional
    */
  }

  // * CardDetails
  @ValidateNested()
  CardDetails: CreditCardDTO;

  // * BankAccountDetails
  @IsOptional()
  @ValidateNested()
  BankAccountDetails: BankAccountDTO | undefined;

  // * Crn1
  @IsNotEmpty({
    message: ErrorFactory.getErrorMessage(ErrorType.NotEmpty, 'Crn1')
  })
  @MaxLength(50, {
    message: ErrorFactory.getErrorMessage(ErrorType.FieldTooLong, 'Crn1')
  })
  Crn1: string;

  // * AcceptBADirectDebitTC
  AcceptBADirectDebitTC = true; // TODO: ensure proper information to customer prior to collecting details.

  // * EmailAddress
  @IsNotEmpty({
    message: ErrorFactory.getErrorMessage(ErrorType.NotEmpty, 'EmailAddress')
  })
  @IsEmail(undefined, {
    message: ErrorFactory.getErrorMessage(ErrorType.NotAnEmail, 'EmailAddress')
  })
  @MaxLength(250, {
    message: ErrorFactory.getErrorMessage(ErrorType.FieldTooLong, 'EmailAddress')
  })
  EmailAddress: string;
}
