import {
  IsNotEmpty,
} from 'class-validator'

import {
  ErrorType,
  Errors,
} from '@atomixdesign/nodepay-core/validation/errors'

export class BankAccountDTO {
  constructor(
    {
      bsb,
      accountNumber,
      accountName,
    }:
      {
        bsb: string
        accountNumber: string
        accountName: string
      }) {
    this.paymentMethod = 'bankAccount'
    this.bsb = bsb
    this.accountNumber = accountNumber
    this.accountName = accountName
  }

  // * paymentMethod
  paymentMethod: string;

  // * bsb
  @IsNotEmpty({
    message: Errors.getErrorMessage(ErrorType.NotEmpty, 'bsb')
  })
  bsb: string;

  // * accountNumber
  @IsNotEmpty({
    message: Errors.getErrorMessage(ErrorType.NotEmpty, 'accountNumber')
  })
  accountNumber: string;

  // * accountName
  @IsNotEmpty({
    message: Errors.getErrorMessage(ErrorType.NotEmpty, 'accountName')
  })
  accountName: string;
}
