import {
  IsNotEmpty,
} from 'class-validator'

import {
  ErrorType,
  ErrorFactory,
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
    message: ErrorFactory.getErrorMessage(ErrorType.NotEmpty, 'bsb')
  })
  bsb: string;

  // * accountNumber
  @IsNotEmpty({
    message: ErrorFactory.getErrorMessage(ErrorType.NotEmpty, 'accountNumber')
  })
  accountNumber: string;

  // * accountName
  @IsNotEmpty({
    message: ErrorFactory.getErrorMessage(ErrorType.NotEmpty, 'accountName')
  })
  accountName: string;
}
